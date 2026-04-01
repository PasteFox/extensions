# PasteFox for VS Code / Kiro

> Part of [PasteFox Extensions](https://github.com/PasteFox/extensions) · [pastefox.com](https://pastefox.com)

Share code snippets directly from your editor to PasteFox.

## Install

- **VS Marketplace:** [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=PasteFox.pastefox)
- **Open VSX:** [open-vsx.org/extension/pastefox/pastefox](https://open-vsx.org/extension/pastefox/pastefox)
- **Manual:** Download `.vsix` from [Releases](https://github.com/PasteFox/extensions/releases) → `Extensions: Install from VSIX`

## Setup

1. Install the extension
2. Open command palette (`Ctrl+Shift+P`) → `PasteFox: Set API Key`
3. Enter your key from [pastefox.com/dashboard/api-keys](https://pastefox.com/dashboard/api-keys)

## Features

- **Create Paste from Selection** — select code, right-click, share
- **Create Paste from File** — share the entire active file
- **Upload from Explorer** — right-click any file in the sidebar
- **Quick Paste** — one shortcut, no prompts, instant share (`Ctrl+Shift+P Ctrl+Shift+U`)
- **Open Paste** — fetch any paste by slug or URL into a new editor tab
- **List My Pastes** — browse and open your recent pastes
- **Delete Paste** — remove a paste by slug
- **Visibility Control** — Public, Unlisted, or Private per paste
- **Auto Expiration** — 10m, 1h, 1d, 7d, 30d, or never
- **Status Bar** — quick access button in the bottom bar
- **Custom Domains** — works with PasteFox custom domains

## Commands

| Command | Description |
|---------|-------------|
| `PasteFox: Create Paste from Selection` | Share selected text or entire file |
| `PasteFox: Create Paste from File` | Share the entire active file |
| `PasteFox: Quick Paste` | Instant paste with defaults, no prompts |
| `PasteFox: Upload to PasteFox` | Upload a file from the explorer sidebar |
| `PasteFox: Open Paste by Slug` | Fetch a paste into a new editor tab |
| `PasteFox: List My Pastes` | Browse your recent pastes |
| `PasteFox: Delete Paste` | Delete a paste by slug |
| `PasteFox: Set API Key` | Configure your API key |
| `PasteFox: Remove API Key` | Remove stored API key |
| `PasteFox: Set Instance URL` | Point to a custom domain |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `pastefox.instanceUrl` | `https://pastefox.com` | PasteFox URL or custom domain |
| `pastefox.defaultVisibility` | `UNLISTED` | Default visibility |
| `pastefox.defaultExpiration` | `never` | Default expiration |
| `pastefox.openInBrowser` | `true` | Open URL in browser after creation |
| `pastefox.copyUrlToClipboard` | `true` | Copy URL to clipboard |
| `pastefox.showStatusBar` | `true` | Show status bar button |
| `pastefox.skipTitlePrompt` | `false` | Use filename as title automatically |
| `pastefox.skipVisibilityPrompt` | `false` | Use default visibility without asking |
| `pastefox.includeLineNumbers` | `false` | Prepend line numbers |
| `pastefox.appendFileInfo` | `false` | Add source filename as comment header |
| `pastefox.maxContentLength` | `500000` | Max content length in characters |
| `pastefox.notificationStyle` | `full` | full, minimal, or silent |

## Other Extensions

- [Chrome Extension](../chrome) — share from your browser
- [Firefox Extension](../firefox) — share from Firefox
- [IntelliJ Plugin](../intellij) — share from JetBrains IDEs
- [CLI](../cli) — share from the terminal
- [GitHub Action](../github-action) — share from CI/CD workflows

## License

MIT
