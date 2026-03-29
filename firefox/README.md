# PasteFox for Firefox

> Part of [PasteFox Extensions](https://github.com/PasteFox/extensions) · [pastefox.com](https://pastefox.com)

Share code and text snippets to PasteFox directly from Firefox.

## Install

**Temporary (for testing):**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from the `firefox/` folder

## Setup

1. Click the PasteFox icon in the toolbar
2. Click "Settings" in the footer
3. Enter your API key from [pastefox.com/dashboard/api-keys](https://pastefox.com/dashboard/api-keys)

## Features

- **Right-click to share** — select text on any page → right-click → "Share to PasteFox"
- **Popup editor** — paste or type code, set visibility and expiration
- **Paste from page** — grab entire page content with one click
- **Auto-fill selection** — selected text loads into the popup automatically
- **Visibility control** — Public, Unlisted, or Private
- **Expiration** — 10m, 1h, 1d, 7d, 30d, or never
- **Clipboard copy** — URL copied automatically
- **Custom domains** — works with PasteFox custom domains

## Settings

Click "Settings" in the popup footer.

| Setting | Default | Description |
|---------|---------|-------------|
| API Key | — | Your PasteFox API key |
| Instance URL | `https://pastefox.com` | PasteFox URL or custom domain |
| Default Visibility | Unlisted | PUBLIC, UNLISTED, or PRIVATE |
| Default Expiration | Never | 10m, 1h, 1d, 7d, 30d, or never |
| Open in new tab | On | Open paste URL after creation |
| Copy to clipboard | On | Copy URL to clipboard |
| Notifications | On | Show notifications |

## Compatibility

- Firefox 109+
- Based on Manifest V3

## Other Extensions

- [Chrome Extension](../chrome) — for Chrome, Edge, Brave
- [VS Code / Kiro](../vscode) — share from your editor
- [IntelliJ Plugin](../intellij) — share from JetBrains IDEs
- [CLI](../cli) — share from the terminal

## License

MIT
