import * as vscode from "vscode";

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript", typescript: "typescript", python: "python",
  java: "java", csharp: "csharp", cpp: "cpp", c: "c", go: "go",
  rust: "rust", php: "php", ruby: "ruby", swift: "swift", kotlin: "kotlin",
  html: "html", css: "css", scss: "scss", json: "json", xml: "xml",
  yaml: "yaml", sql: "sql", shellscript: "bash", powershell: "powershell",
  markdown: "markdown", plaintext: "plaintext", dockercompose: "yaml",
  dockerfile: "bash", makefile: "bash", toml: "toml", ini: "ini",
  bat: "bash", lua: "lua", perl: "perl", r: "r", dart: "dart",
  typescriptreact: "typescript", javascriptreact: "javascript",
};

const COMMENT_PREFIXES: Record<string, string> = {
  javascript: "//", typescript: "//", python: "#", java: "//", csharp: "//",
  cpp: "//", c: "//", go: "//", rust: "//", php: "//", ruby: "#",
  swift: "//", kotlin: "//", html: "<!--", css: "/*", scss: "//",
  yaml: "#", sql: "--", bash: "#", powershell: "#", markdown: "<!--",
  lua: "--", perl: "#", r: "#", dart: "//", toml: "#", ini: ";",
};

const EXPIRATION_MAP: Record<string, number> = {
  "10m": 10 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

interface Config {
  instanceUrl: string;
  defaultVisibility: string;
  defaultExpiration: string;
  openInBrowser: boolean;
  copyUrlToClipboard: boolean;
  showStatusBar: boolean;
  skipTitlePrompt: boolean;
  skipVisibilityPrompt: boolean;
  includeLineNumbers: boolean;
  appendFileInfo: boolean;
  maxContentLength: number;
  notificationStyle: "full" | "minimal" | "silent";
}

function getConfig(): Config {
  const cfg = vscode.workspace.getConfiguration("pastefox");
  return {
    instanceUrl: (cfg.get<string>("instanceUrl") || "https://pastefox.com").replace(/\/$/, ""),
    defaultVisibility: cfg.get<string>("defaultVisibility") || "UNLISTED",
    defaultExpiration: cfg.get<string>("defaultExpiration") || "never",
    openInBrowser: cfg.get<boolean>("openInBrowser") ?? true,
    copyUrlToClipboard: cfg.get<boolean>("copyUrlToClipboard") ?? true,
    showStatusBar: cfg.get<boolean>("showStatusBar") ?? true,
    skipTitlePrompt: cfg.get<boolean>("skipTitlePrompt") ?? false,
    skipVisibilityPrompt: cfg.get<boolean>("skipVisibilityPrompt") ?? false,
    includeLineNumbers: cfg.get<boolean>("includeLineNumbers") ?? false,
    appendFileInfo: cfg.get<boolean>("appendFileInfo") ?? false,
    maxContentLength: cfg.get<number>("maxContentLength") ?? 500000,
    notificationStyle: cfg.get<string>("notificationStyle") as Config["notificationStyle"] || "full",
  };
}

// ── API helpers ──

async function getApiKey(ctx: vscode.ExtensionContext): Promise<string | undefined> {
  return ctx.secrets.get("pastefox.apiKey");
}

async function requireApiKey(ctx: vscode.ExtensionContext): Promise<string | null> {
  let key = await getApiKey(ctx);
  if (key) return key;

  const action = await vscode.window.showWarningMessage(
    "PasteFox: No API key configured.",
    "Set API Key", "Cancel"
  );
  if (action !== "Set API Key") return null;

  key = await vscode.window.showInputBox({
    prompt: "Enter your PasteFox API key",
    placeHolder: "pk_...",
    password: true,
    validateInput: (v) => v.length < 10 ? "API key seems too short" : null,
  });
  if (!key) return null;

  await ctx.secrets.store("pastefox.apiKey", key);
  vscode.window.showInformationMessage("PasteFox: API key saved.");
  return key;
}

interface PasteData {
  slug: string; id: string; title: string; visibility: string;
  content?: string; language?: string | null;
}

async function apiCreatePaste(
  apiKey: string, instanceUrl: string,
  body: Record<string, unknown>
): Promise<{ success: boolean; data?: PasteData; error?: string }> {
  const res = await fetch(`${instanceUrl}/api/v1/pastes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<any>;
}

async function apiGetPaste(instanceUrl: string, slug: string): Promise<{ success: boolean; data?: PasteData; error?: string }> {
  const res = await fetch(`${instanceUrl}/api/v1/pastes/${slug}`);
  return res.json() as Promise<any>;
}

async function apiListPastes(apiKey: string, instanceUrl: string, page = 1): Promise<{ success: boolean; data?: { items: PasteData[]; total: number; totalPages: number }; error?: string }> {
  const res = await fetch(`${instanceUrl}/api/v1/pastes?page=${page}&limit=20&sortBy=createdAt&sortOrder=desc`, {
    headers: { "X-API-Key": apiKey },
  });
  return res.json() as Promise<any>;
}

async function apiDeletePaste(apiKey: string, instanceUrl: string, slug: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${instanceUrl}/api/v1/pastes/${slug}`, {
    method: "DELETE",
    headers: { "X-API-Key": apiKey },
  });
  return res.json() as Promise<any>;
}

// ── Helpers ──

function mapLanguage(langId: string): string | null {
  return LANGUAGE_MAP[langId] || langId || null;
}

function getExpirationDate(expiration: string): string | null {
  const ms = EXPIRATION_MAP[expiration];
  if (!ms) return null;
  return new Date(Date.now() + ms).toISOString();
}

function addLineNumbers(content: string, startLine: number): string {
  const lines = content.split("\n");
  const pad = String(startLine + lines.length - 1).length;
  return lines.map((line, i) => `${String(startLine + i).padStart(pad)} | ${line}`).join("\n");
}

function addFileInfoHeader(content: string, fileName: string, langId: string, startLine?: number, endLine?: number): string {
  const prefix = COMMENT_PREFIXES[mapLanguage(langId) || ""] || "//";
  const suffix = prefix === "<!--" ? " -->" : prefix === "/*" ? " */" : "";
  const lineInfo = startLine && endLine ? ` (lines ${startLine}-${endLine})` : "";
  return `${prefix} Source: ${fileName}${lineInfo}${suffix}\n\n${content}`;
}

async function promptVisibility(defaultVis: string): Promise<string | undefined> {
  const item = await vscode.window.showQuickPick([
    { label: "$(globe) Public", description: "Visible to everyone", value: "PUBLIC" },
    { label: "$(link) Unlisted", description: "Accessible via link only", value: "UNLISTED" },
    { label: "$(lock) Private", description: "Only you can see it", value: "PRIVATE" },
  ], { placeHolder: "Select paste visibility" });
  return item?.value ?? defaultVis;
}

async function handleResult(config: Config, pasteUrl: string) {
  if (config.copyUrlToClipboard) {
    await vscode.env.clipboard.writeText(pasteUrl);
  }

  if (config.notificationStyle === "silent") return;

  if (config.notificationStyle === "minimal") {
    vscode.window.setStatusBarMessage(`$(check) PasteFox: ${pasteUrl}`, 5000);
    return;
  }

  const action = await vscode.window.showInformationMessage(
    `Paste created!${config.copyUrlToClipboard ? " URL copied." : ""}`,
    "Open in Browser", "Copy URL"
  );

  if (action === "Open in Browser") {
    vscode.env.openExternal(vscode.Uri.parse(pasteUrl));
  } else if (action === "Copy URL") {
    await vscode.env.clipboard.writeText(pasteUrl);
  }

  if (config.openInBrowser && !action) {
    vscode.env.openExternal(vscode.Uri.parse(pasteUrl));
  }
}

// ── Core paste creation ──

async function handleCreatePaste(
  ctx: vscode.ExtensionContext,
  content: string,
  fileName: string,
  langId: string,
  options?: { quick?: boolean; startLine?: number; endLine?: number }
) {
  const apiKey = await requireApiKey(ctx);
  if (!apiKey) return;

  const config = getConfig();

  // Content length check
  if (config.maxContentLength > 0 && content.length > config.maxContentLength) {
    const proceed = await vscode.window.showWarningMessage(
      `Content is ${(content.length / 1000).toFixed(0)}KB. Max is ${(config.maxContentLength / 1000).toFixed(0)}KB. Truncate?`,
      "Truncate & Paste", "Cancel"
    );
    if (proceed !== "Truncate & Paste") return;
    content = content.substring(0, config.maxContentLength);
  }

  // Add line numbers if enabled
  if (config.includeLineNumbers && options?.startLine) {
    content = addLineNumbers(content, options.startLine);
  }

  // Add file info header if enabled
  if (config.appendFileInfo) {
    content = addFileInfoHeader(content, fileName, langId, options?.startLine, options?.endLine);
  }

  // Visibility
  let visibility = config.defaultVisibility;
  if (!config.skipVisibilityPrompt && !options?.quick) {
    const picked = await promptVisibility(config.defaultVisibility);
    if (!picked) return;
    visibility = picked;
  }

  // Title
  let title = fileName;
  if (!config.skipTitlePrompt && !options?.quick) {
    const input = await vscode.window.showInputBox({
      prompt: "Paste title (optional)",
      value: fileName,
      placeHolder: "My code snippet",
    });
    if (input === undefined) return;
    title = input || fileName;
  }

  const language = mapLanguage(langId);
  const expiresAt = getExpirationDate(config.defaultExpiration);

  const body: Record<string, unknown> = { content, title, visibility };
  if (language) body.language = language;
  if (expiresAt) body.expiresAt = expiresAt;

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "PasteFox: Creating paste..." },
    async () => {
      try {
        const result = await apiCreatePaste(apiKey, config.instanceUrl, body);
        if (!result.success || !result.data) {
          vscode.window.showErrorMessage(`PasteFox: ${result.error || "Failed to create paste"}`);
          return;
        }
        await handleResult(config, `${config.instanceUrl}/${result.data.slug}`);
      } catch (err: any) {
        vscode.window.showErrorMessage(`PasteFox: ${err.message || "Network error"}`);
      }
    }
  );
}

// ── Activation ──

export function activate(ctx: vscode.ExtensionContext) {
  const config = getConfig();

  // Create paste from selection
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.createPaste", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { vscode.window.showWarningMessage("PasteFox: No active editor"); return; }

      const selection = editor.selection;
      const content = editor.document.getText(selection.isEmpty ? undefined : selection);
      if (!content.trim()) { vscode.window.showWarningMessage("PasteFox: No content to paste"); return; }

      const fileName = editor.document.fileName.split(/[/\\]/).pop() || "untitled";
      const startLine = selection.isEmpty ? 1 : selection.start.line + 1;
      const endLine = selection.isEmpty ? editor.document.lineCount : selection.end.line + 1;

      await handleCreatePaste(ctx, content, fileName, editor.document.languageId, { startLine, endLine });
    })
  );

  // Create paste from entire file
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.createPasteFromFile", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { vscode.window.showWarningMessage("PasteFox: No active editor"); return; }

      const content = editor.document.getText();
      if (!content.trim()) { vscode.window.showWarningMessage("PasteFox: File is empty"); return; }

      const fileName = editor.document.fileName.split(/[/\\]/).pop() || "untitled";
      await handleCreatePaste(ctx, content, fileName, editor.document.languageId);
    })
  );

  // Create paste from explorer right-click
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.createPasteFromExplorer", async (uri?: vscode.Uri) => {
      if (!uri) {
        vscode.window.showWarningMessage("PasteFox: No file selected");
        return;
      }

      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        const content = doc.getText();
        if (!content.trim()) { vscode.window.showWarningMessage("PasteFox: File is empty"); return; }

        const fileName = uri.fsPath.split(/[/\\]/).pop() || "untitled";
        await handleCreatePaste(ctx, content, fileName, doc.languageId);
      } catch (err: any) {
        vscode.window.showErrorMessage(`PasteFox: Could not read file — ${err.message}`);
      }
    })
  );

  // Quick paste — no prompts, uses all defaults
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.createPasteQuick", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { vscode.window.showWarningMessage("PasteFox: No active editor"); return; }

      const selection = editor.selection;
      const content = editor.document.getText(selection.isEmpty ? undefined : selection);
      if (!content.trim()) { vscode.window.showWarningMessage("PasteFox: No content to paste"); return; }

      const fileName = editor.document.fileName.split(/[/\\]/).pop() || "untitled";
      await handleCreatePaste(ctx, content, fileName, editor.document.languageId, { quick: true });
    })
  );

  // Open paste by slug
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.openPaste", async () => {
      const cfg = getConfig();
      const slug = await vscode.window.showInputBox({
        prompt: "Enter paste slug or URL",
        placeHolder: "abc123 or https://pastefox.com/abc123",
      });
      if (!slug) return;

      const cleanSlug = slug.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");

      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: "PasteFox: Fetching paste..." },
        async () => {
          try {
            const result = await apiGetPaste(cfg.instanceUrl, cleanSlug);
            if (!result.success || !result.data) {
              vscode.window.showErrorMessage(`PasteFox: ${result.error || "Paste not found"}`);
              return;
            }
            const lang = result.data.language || "plaintext";
            const doc = await vscode.workspace.openTextDocument({ content: result.data.content || "", language: lang });
            await vscode.window.showTextDocument(doc);
          } catch (err: any) {
            vscode.window.showErrorMessage(`PasteFox: ${err.message || "Network error"}`);
          }
        }
      );
    })
  );

  // List my pastes
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.listMyPastes", async () => {
      const apiKey = await requireApiKey(ctx);
      if (!apiKey) return;
      const cfg = getConfig();

      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: "PasteFox: Loading pastes..." },
        async () => {
          try {
            const result = await apiListPastes(apiKey, cfg.instanceUrl);
            if (!result.success || !result.data) {
              vscode.window.showErrorMessage(`PasteFox: ${result.error || "Failed to load pastes"}`);
              return;
            }

            const items = result.data.items.map((p) => ({
              label: `$(file-code) ${p.title || "Untitled"}`,
              description: p.slug,
              detail: `${p.visibility} · ${p.language || "text"}`,
              slug: p.slug,
            }));

            if (items.length === 0) {
              vscode.window.showInformationMessage("PasteFox: No pastes found.");
              return;
            }

            const picked = await vscode.window.showQuickPick(items, {
              placeHolder: `${result.data.total} pastes — select to open`,
              matchOnDescription: true,
              matchOnDetail: true,
            });

            if (picked) {
              vscode.commands.executeCommand("pastefox.openPaste");
              // Pre-fill would be nice but QuickPick doesn't support it,
              // so we open the paste directly
              const pasteResult = await apiGetPaste(cfg.instanceUrl, picked.slug);
              if (pasteResult.success && pasteResult.data) {
                const lang = pasteResult.data.language || "plaintext";
                const doc = await vscode.workspace.openTextDocument({ content: pasteResult.data.content || "", language: lang });
                await vscode.window.showTextDocument(doc);
              }
            }
          } catch (err: any) {
            vscode.window.showErrorMessage(`PasteFox: ${err.message || "Network error"}`);
          }
        }
      );
    })
  );

  // Delete paste
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.deletePaste", async () => {
      const apiKey = await requireApiKey(ctx);
      if (!apiKey) return;
      const cfg = getConfig();

      const slug = await vscode.window.showInputBox({
        prompt: "Enter paste slug to delete",
        placeHolder: "abc123",
      });
      if (!slug) return;

      const confirm = await vscode.window.showWarningMessage(
        `Delete paste "${slug}"? This cannot be undone.`,
        { modal: true }, "Delete"
      );
      if (confirm !== "Delete") return;

      try {
        const result = await apiDeletePaste(apiKey, cfg.instanceUrl, slug);
        if (result.success) {
          vscode.window.showInformationMessage(`PasteFox: Paste "${slug}" deleted.`);
        } else {
          vscode.window.showErrorMessage(`PasteFox: ${result.error || "Failed to delete"}`);
        }
      } catch (err: any) {
        vscode.window.showErrorMessage(`PasteFox: ${err.message || "Network error"}`);
      }
    })
  );

  // Set API key
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.setApiKey", async () => {
      const key = await vscode.window.showInputBox({
        prompt: "Enter your PasteFox API key (from Dashboard > API Keys)",
        placeHolder: "pk_...",
        password: true,
        validateInput: (v) => v.length < 10 ? "API key seems too short" : null,
      });
      if (!key) return;
      await ctx.secrets.store("pastefox.apiKey", key);
      vscode.window.showInformationMessage("PasteFox: API key saved.");
    })
  );

  // Remove API key
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.removeApiKey", async () => {
      await ctx.secrets.delete("pastefox.apiKey");
      vscode.window.showInformationMessage("PasteFox: API key removed.");
    })
  );

  // Set instance URL
  ctx.subscriptions.push(
    vscode.commands.registerCommand("pastefox.setInstance", async () => {
      const cfg = getConfig();
      const url = await vscode.window.showInputBox({
        prompt: "Enter your PasteFox instance URL",
        value: cfg.instanceUrl,
        placeHolder: "https://pastefox.com",
        validateInput: (v) => { try { new URL(v); return null; } catch { return "Invalid URL"; } },
      });
      if (!url) return;
      await vscode.workspace.getConfiguration("pastefox").update("instanceUrl", url.replace(/\/$/, ""), true);
      vscode.window.showInformationMessage(`PasteFox: Instance set to ${url}`);
    })
  );

  // Status bar
  if (config.showStatusBar) {
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = "$(cloud-upload) PasteFox";
    statusBar.tooltip = "Create paste from selection";
    statusBar.command = "pastefox.createPaste";
    statusBar.show();
    ctx.subscriptions.push(statusBar);

    // React to config changes
    ctx.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("pastefox.showStatusBar")) {
          const show = vscode.workspace.getConfiguration("pastefox").get<boolean>("showStatusBar");
          if (show) statusBar.show(); else statusBar.hide();
        }
      })
    );
  }
}

export function deactivate() {}
