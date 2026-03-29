# PasteFox for Chrome

> Part of [PasteFox Extensions](https://github.com/PasteFox/extensions) · [pastefox.com](https://pastefox.com)

Share code and text snippets to PasteFox directly from your browser.

## Install

1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" → select the `chrome/` folder

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

## Usage

### From the popup
1. Click the PasteFox icon
2. Paste or type your content
3. Set title, visibility, and expiration
4. Click "Create Paste"

### From any page
1. Select text on any webpage
2. Right-click → "Share to PasteFox"

### Settings
Click "Settings" in the popup footer, or right-click the PasteFox icon → Options.

| Setting | Default | Description |
|---------|---------|-------------|
| API Key | — | Your PasteFox API key |
| Instance URL | `https://pastefox.com` | PasteFox URL or custom domain |
| Default Visibility | Unlisted | PUBLIC, UNLISTED, or PRIVATE |
| Default Expiration | Never | 10m, 1h, 1d, 7d, 30d, or never |
| Open in new tab | On | Open paste URL after creation |
| Copy to clipboard | On | Copy URL to clipboard |
| Notifications | On | Show browser notifications |

## Permissions

| Permission | Reason |
|------------|--------|
| `storage` | Save API key and settings |
| `contextMenus` | "Share to PasteFox" in right-click menu |
| `activeTab` | Read selected text from the current page |
| `scripting` | Read page content when user clicks "Paste from Current Page" |

## Other Extensions

- [VS Code / Kiro](../vscode) — share from your editor
- [Firefox Extension](../firefox) — share from Firefox
- [IntelliJ Plugin](../intellij) — share from JetBrains IDEs
- [CLI](../cli) — share from the terminal
- [GitHub Action](../github-action) — share from CI/CD workflows

## License

MIT
