#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join, extname, basename } from "path";

const VERSION = "1.0.0";
const CONFIG_DIR = join(homedir(), ".pastefox");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

const EXT_TO_LANG = {
  js: "javascript", ts: "typescript", py: "python", java: "java",
  cs: "csharp", cpp: "cpp", c: "c", go: "go", rs: "rust",
  php: "php", rb: "ruby", swift: "swift", kt: "kotlin",
  html: "html", css: "css", scss: "scss", json: "json", xml: "xml",
  yaml: "yaml", yml: "yaml", sql: "sql", sh: "bash", bash: "bash",
  ps1: "powershell", md: "markdown", txt: "plaintext",
  toml: "toml", ini: "ini", lua: "lua", pl: "perl", r: "r",
  dart: "dart", tsx: "typescript", jsx: "javascript",
};

const EXPIRATION_MS = {
  "10m": 10 * 60 * 1000, "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000, "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

// ── Config ──

function loadConfig() {
  if (!existsSync(CONFIG_FILE)) return {};
  try { return JSON.parse(readFileSync(CONFIG_FILE, "utf-8")); } catch { return {}; }
}

function saveConfig(config) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function getConfig() {
  const config = loadConfig();
  return {
    apiKey: config.apiKey || process.env.PASTEFOX_API_KEY || "",
    instanceUrl: (config.instanceUrl || process.env.PASTEFOX_URL || "https://pastefox.com").replace(/\/$/, ""),
    defaultVisibility: config.defaultVisibility || "UNLISTED",
    defaultExpiration: config.defaultExpiration || "never",
  };
}

// ── API ──

async function apiRequest(method, path, config, body) {
  const url = `${config.instanceUrl}/api/v1${path}`;
  const headers = { "Content-Type": "application/json" };
  if (config.apiKey) headers["X-API-Key"] = config.apiKey;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ── Helpers ──

function detectLanguage(filename) {
  const ext = extname(filename).slice(1).toLowerCase();
  return EXT_TO_LANG[ext] || null;
}

function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) { resolve(null); return; }
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => data += chunk);
    process.stdin.on("end", () => resolve(data || null));
  });
}

function parseArgs(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const [key, ...val] = arg.slice(2).split("=");
      flags[key] = val.length ? val.join("=") : (args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true);
    } else if (arg.startsWith("-") && arg.length === 2) {
      flags[arg.slice(1)] = args[i + 1] && !args[i + 1].startsWith("-") ? args[++i] : true;
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

// ── Commands ──

async function cmdCreate(args) {
  const { flags, positional } = parseArgs(args);
  const config = getConfig();

  if (!config.apiKey) {
    console.error(c("red", "No API key configured. Run: pastefox login"));
    process.exit(1);
  }

  // Read content from file, stdin, or --content flag
  let content = flags.content || flags.c || null;
  let filename = "untitled";
  let language = flags.language || flags.l || null;

  if (positional[0]) {
    const file = positional[0];
    if (!existsSync(file)) { console.error(c("red", `File not found: ${file}`)); process.exit(1); }
    content = readFileSync(file, "utf-8");
    filename = basename(file);
    if (!language) language = detectLanguage(file);
  }

  if (!content) {
    content = await readStdin();
  }

  if (!content || !content.trim()) {
    console.error(c("red", "No content provided. Use: pastefox create <file> or pipe content."));
    process.exit(1);
  }

  const title = flags.title || flags.t || filename;
  const visibility = (flags.visibility || flags.v || config.defaultVisibility).toUpperCase();
  const expiration = flags.expires || flags.e || config.defaultExpiration;

  const body = { content, title, visibility };
  if (language) body.language = language;
  if (expiration !== "never" && EXPIRATION_MS[expiration]) {
    body.expiresAt = new Date(Date.now() + EXPIRATION_MS[expiration]).toISOString();
  }

  const result = await apiRequest("POST", "/pastes", config, body);

  if (result.success && result.data) {
    const url = `${config.instanceUrl}/${result.data.slug}`;
    console.log(c("green", "✓ Paste created"));
    console.log(`  ${c("cyan", url)}`);
    console.log(`  ${c("gray", `slug: ${result.data.slug} · ${visibility.toLowerCase()} · ${language || "auto"}`)}`);
  } else {
    console.error(c("red", `✗ ${result.error || "Failed to create paste"}`));
    process.exit(1);
  }
}

async function cmdGet(args) {
  const { positional } = parseArgs(args);
  const config = getConfig();
  const slug = (positional[0] || "").replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");

  if (!slug) { console.error(c("red", "Usage: pastefox get <slug>")); process.exit(1); }

  const result = await apiRequest("GET", `/pastes/${slug}`, config);

  if (result.success && result.data) {
    process.stdout.write(result.data.content || "");
  } else {
    console.error(c("red", `✗ ${result.error || "Paste not found"}`));
    process.exit(1);
  }
}

async function cmdList(args) {
  const { flags } = parseArgs(args);
  const config = getConfig();

  if (!config.apiKey) { console.error(c("red", "No API key. Run: pastefox login")); process.exit(1); }

  const page = flags.page || flags.p || "1";
  const result = await apiRequest("GET", `/pastes?page=${page}&limit=20&sortBy=createdAt&sortOrder=desc`, config);

  if (result.success && result.data) {
    const items = result.data.items || [];
    if (items.length === 0) { console.log(c("gray", "No pastes found.")); return; }

    console.log(c("bold", `  Your pastes (page ${result.data.page || page}/${result.data.totalPages || "?"}):\n`));
    for (const p of items) {
      const vis = p.visibility === "PUBLIC" ? c("green", "pub") : p.visibility === "UNLISTED" ? c("yellow", "unl") : c("red", "prv");
      console.log(`  ${c("cyan", p.slug.padEnd(12))} ${vis}  ${c("dim", (p.language || "text").padEnd(12))} ${p.title || "Untitled"}`);
    }
    console.log(`\n  ${c("gray", `${result.data.total || items.length} total`)}`);
  } else {
    console.error(c("red", `✗ ${result.error || "Failed to list pastes"}`));
    process.exit(1);
  }
}

async function cmdDelete(args) {
  const { positional } = parseArgs(args);
  const config = getConfig();
  const slug = positional[0];

  if (!slug) { console.error(c("red", "Usage: pastefox delete <slug>")); process.exit(1); }
  if (!config.apiKey) { console.error(c("red", "No API key. Run: pastefox login")); process.exit(1); }

  const result = await apiRequest("DELETE", `/pastes/${slug}`, config);

  if (result.success) {
    console.log(c("green", `✓ Paste "${slug}" deleted`));
  } else {
    console.error(c("red", `✗ ${result.error || "Failed to delete"}`));
    process.exit(1);
  }
}

function cmdLogin(args) {
  const { positional } = parseArgs(args);
  const key = positional[0];

  if (!key) {
    console.error(c("red", "Usage: pastefox login <api-key>"));
    console.log(c("gray", "  Get your key at https://pastefox.com/dashboard/api-keys"));
    process.exit(1);
  }

  const config = loadConfig();
  config.apiKey = key;
  saveConfig(config);
  console.log(c("green", "✓ API key saved to ~/.pastefox/config.json"));
}

function cmdLogout() {
  const config = loadConfig();
  delete config.apiKey;
  saveConfig(config);
  console.log(c("green", "✓ API key removed"));
}

function cmdConfig(args) {
  const { flags } = parseArgs(args);
  const config = loadConfig();

  if (flags.url) config.instanceUrl = flags.url.replace(/\/$/, "");
  if (flags.visibility) config.defaultVisibility = flags.visibility.toUpperCase();
  if (flags.expires) config.defaultExpiration = flags.expires;

  if (Object.keys(flags).length > 0) {
    saveConfig(config);
    console.log(c("green", "✓ Config updated"));
  }

  const current = getConfig();
  console.log(`\n  ${c("bold", "PasteFox CLI Config")}\n`);
  console.log(`  API Key:     ${current.apiKey ? c("green", current.apiKey.slice(0, 8) + "...") : c("red", "not set")}`);
  console.log(`  Instance:    ${c("cyan", current.instanceUrl)}`);
  console.log(`  Visibility:  ${current.defaultVisibility}`);
  console.log(`  Expiration:  ${current.defaultExpiration}`);
  console.log(`  Config file: ${c("gray", CONFIG_FILE)}\n`);
}

// ── Help ──

function showHelp() {
  console.log(`
  ${c("bold", "🦊 PasteFox CLI")} ${c("gray", `v${VERSION}`)}

  ${c("bold", "Usage:")}
    pastefox <command> [options]

  ${c("bold", "Commands:")}
    ${c("cyan", "create")} <file>       Create a paste from a file
    ${c("cyan", "get")} <slug>          Fetch paste content (prints to stdout)
    ${c("cyan", "list")}               List your pastes
    ${c("cyan", "delete")} <slug>       Delete a paste
    ${c("cyan", "login")} <api-key>     Save your API key
    ${c("cyan", "logout")}             Remove saved API key
    ${c("cyan", "config")}             View or update settings

  ${c("bold", "Create Options:")}
    -t, --title <title>         Paste title
    -v, --visibility <vis>      PUBLIC, UNLISTED, or PRIVATE
    -l, --language <lang>       Language (auto-detected from file extension)
    -e, --expires <time>        10m, 1h, 1d, 7d, 30d, or never

  ${c("bold", "Config Options:")}
    --url <url>                 Set instance URL
    --visibility <vis>          Set default visibility
    --expires <time>            Set default expiration

  ${c("bold", "Examples:")}
    ${c("gray", "# Create paste from file")}
    pastefox create main.py

    ${c("gray", "# Pipe content")}
    cat error.log | pastefox create --title "Error log" --expires 1h

    ${c("gray", "# Create private paste")}
    pastefox create secret.txt -v private -e 1d

    ${c("gray", "# Fetch paste to file")}
    pastefox get abc123 > output.py

    ${c("gray", "# List your pastes")}
    pastefox list

    ${c("gray", "# Use custom domain")}
    pastefox config --url https://paste.yourdomain.com
`);
}

// ── Main ──

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "create": case "c": case "new": case "upload": case "push":
    cmdCreate(args); break;
  case "get": case "g": case "fetch": case "read": case "view":
    cmdGet(args); break;
  case "list": case "ls": case "l":
    cmdList(args); break;
  case "delete": case "del": case "rm": case "remove":
    cmdDelete(args); break;
  case "login": case "auth":
    cmdLogin(args); break;
  case "logout":
    cmdLogout(); break;
  case "config": case "settings":
    cmdConfig(args); break;
  case "version": case "-v": case "--version":
    console.log(`pastefox-cli v${VERSION}`); break;
  case "help": case "-h": case "--help": case undefined:
    showHelp(); break;
  default:
    // If argument is a file, treat as `create <file>`
    if (existsSync(command)) { cmdCreate([command, ...args]); }
    else { console.error(c("red", `Unknown command: ${command}`)); showHelp(); process.exit(1); }
}
