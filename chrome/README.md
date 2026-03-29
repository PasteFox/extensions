# PasteFox for Chrome

Share code and text snippets to [PasteFox](https://pastefox.com) directly from your browser.

## Features

- **Right-click to share** — select text on any page, right-click, share to PasteFox
- **Popup editor** — paste or type code in the popup, set visibility and expiration
- **Paste from page** — grab the entire page content with one click
- **Auto-fill selection** — selected text is automatically loaded into the popup
- **Visibility control** — Public, Unlisted, or Private per paste
- **Expiration** — set auto-expiration (10m, 1h, 1d, 7d, 30d, or never)
- **Clipboard copy** — paste URL is copied to clipboard automatically
- **Custom domains** — works with PasteFox custom domains

## Setup

1. Install the extension
2. Click the PasteFox icon in the toolbar
3. Go to Settings and enter your API key (from [Dashboard > API Keys](https://pastefox.com/dashboard/api-keys))
4. Start sharing

## Usage

### From the popup
1. Click the PasteFox icon
2. Paste or type your content
3. Set title, visibility, and expiration
4. Click "Create Paste"

### From any page
1. Select text on any webpage
2. Right-click → "Share to PasteFox"
3. Paste is created with your default settings

### Settings
Right-click the PasteFox icon → Options, or click "Settings" in the popup footer.

## Permissions

- **storage** — save your API key and settings
- **contextMenus** — add "Share to PasteFox" to the right-click menu
- **activeTab** — read selected text from the current page

## Development

Load as unpacked extension:
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome/` folder
