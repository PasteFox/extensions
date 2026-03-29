import { readFileSync, existsSync, appendFileSync } from "fs";
import { extname, basename } from "path";

// GitHub Actions core helpers (no dependencies needed)
const getInput = (name) => {
  // GitHub Actions sets INPUT_<NAME> with uppercase and hyphens replaced by underscores
  const key = `INPUT_${name.toUpperCase().replace(/-/g, "_")}`;
  return process.env[key] || "";
};
const setOutput = (name, value) => {
  process.stdout.write(`::set-output name=${name}::${value}\n`);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
};
const setFailed = (msg) => { process.stdout.write(`::error::${msg}\n`); process.exit(1); };
const info = (msg) => process.stdout.write(`${msg}\n`);

const EXT_TO_LANG = {
  js: "javascript", ts: "typescript", py: "python", java: "java",
  cs: "csharp", cpp: "cpp", c: "c", go: "go", rs: "rust",
  php: "php", rb: "ruby", sh: "bash", yml: "yaml", yaml: "yaml",
  json: "json", xml: "xml", sql: "sql", md: "markdown", txt: "plaintext",
  html: "html", css: "css", scss: "scss", kt: "kotlin", swift: "swift",
  dart: "dart", toml: "toml", lua: "lua", r: "r",
};

const EXPIRATION_MS = {
  "10m": 10 * 60 * 1000, "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000, "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

async function run() {
  const apiKey = getInput("api-key");
  const contentInput = getInput("content");
  const fileInput = getInput("file");
  const title = getInput("title");
  const visibility = (getInput("visibility") || "UNLISTED").toUpperCase();
  const language = getInput("language");
  const expires = getInput("expires") || "never";
  const instanceUrl = (getInput("instance-url") || "https://pastefox.com").replace(/\/$/, "");

  if (!apiKey) {
    info(`Debug: INPUT_API_KEY="${process.env.INPUT_API_KEY ? "set" : "empty"}"`);
    info(`Debug: INPUT_API-KEY="${process.env["INPUT_API-KEY"] ? "set" : "empty"}"`);
    setFailed("api-key is required. Make sure PASTEFOX_API_KEY is set as a repository secret.");
  }

  // Get content from input or file
  let content = contentInput;
  let filename = "paste";

  if (!content && fileInput) {
    if (!existsSync(fileInput)) setFailed(`File not found: ${fileInput}`);
    content = readFileSync(fileInput, "utf-8");
    filename = basename(fileInput);
  }

  if (!content) setFailed("Either 'content' or 'file' input is required");

  // Build request body
  const body = {
    content,
    title: title || filename,
    visibility,
  };

  // Auto-detect language from file extension
  const lang = language || (fileInput ? EXT_TO_LANG[extname(fileInput).slice(1).toLowerCase()] : null);
  if (lang) body.language = lang;

  // Expiration
  if (expires !== "never" && EXPIRATION_MS[expires]) {
    body.expiresAt = new Date(Date.now() + EXPIRATION_MS[expires]).toISOString();
  }

  info(`Creating paste on ${instanceUrl}...`);
  info(`  Title: ${body.title}`);
  info(`  Visibility: ${visibility}`);
  info(`  Language: ${lang || "auto"}`);
  info(`  Expires: ${expires}`);

  try {
    const res = await fetch(`${instanceUrl}/api/v1/pastes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success && data.data) {
      const pasteUrl = `${instanceUrl}/${data.data.slug}`;

      setOutput("url", pasteUrl);
      setOutput("slug", data.data.slug);
      setOutput("id", data.data.id);

      info(`\n✅ Paste created: ${pasteUrl}`);
      info(`   Slug: ${data.data.slug}`);

      // Write to job summary if available
      if (process.env.GITHUB_STEP_SUMMARY) {
        appendFileSync(process.env.GITHUB_STEP_SUMMARY,
          `### 🦊 PasteFox Paste Created\n\n` +
          `| | |\n|---|---|\n` +
          `| **URL** | [${pasteUrl}](${pasteUrl}) |\n` +
          `| **Slug** | \`${data.data.slug}\` |\n` +
          `| **Visibility** | ${visibility} |\n` +
          `| **Expires** | ${expires} |\n\n`
        );
      }
    } else {
      setFailed(`Failed to create paste: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    setFailed(`Network error: ${err.message}`);
  }
}

run();
