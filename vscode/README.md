# PasteFox for VS Code / Kiro

Share code snippets directly from your editor to [PasteFox](https://pastefox.com).

## Features

- **Create Paste from Selection** — select code, right-click, share
- **Create Paste from File** — share the entire file
- **Upload from Explorer** — right-click any file in the sidebar
- **Quick Paste** — one shortcut, no prompts, instant share
- **Open Paste** — fetch any paste by slug or URL into a new editor tab
- **List My Pastes** — browse and open your recent pastes
- **Delete Paste** — remove a paste by slug
- **Visibility Control** — choose Public, Unlisted, or Private per paste
- **Auto Expiration** — set default expiration (10m, 1h, 1d, 7d, 30d)
- **Status Bar** — quick access button in the bottom bar
- **Secure** — API key stored in VS Code's encrypted secret storage
- **Custom Domains** — works with PasteFox custom domains

## Setup

1. Install the extension
2. Get an API key from [PasteFox Dashboard > API Keys](https://pastefox.com/dashboard/api-keys)
3. Run `PasteFox: Set API Key` from the command palette
4. Start sharing code

## Commands

| Command | Description |
|---------|-------------|
| `PasteFox: Create Paste from Selection` | Share selected text (or entire file if no selection) |
| `PasteFox: Create Paste from File` | Share the entire active file |
| `PasteFox: Quick Paste` | Instant paste with all defaults, no prompts |
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
| `pastefox.instanceUrl` | `https://pastefox.com` | PasteFox instance URL |
| `pastefox.defaultVisibility` | `UNLISTED` | Default visibility for new pastes |
| `pastefox.defaultExpiration` | `never` | Default expiration (never, 10m, 1h, 1d, 7d, 30d) |
| `pastefox.openInBrowser` | `true` | Open paste URL in browser after creation |
| `pastefox.copyUrlToClipboard` | `true` | Copy paste URL to clipboard |
| `pastefox.showStatusBar` | `true` | Show PasteFox button in status bar |
| `pastefox.skipTitlePrompt` | `false` | Use filename as title automatically |
| `pastefox.skipVisibilityPrompt` | `false` | Use default visibility without asking |
| `pastefox.includeLineNumbers` | `false` | Prepend line numbers to pasted content |
| `pastefox.appendFileInfo` | `false` | Add source filename as comment header |
| `pastefox.maxContentLength` | `500000` | Max content length in characters |
| `pastefox.notificationStyle` | `full` | Notification style: full, minimal, or silent |

## Custom Domains

If you have a custom domain configured on PasteFox, you can set it as your instance URL:

```
PasteFox: Set Instance URL → https://paste.yourdomain.com
```

Pastes will be created and opened via your custom domain.

## Keyboard Shortcut

`Ctrl+Shift+P Ctrl+Shift+U` — Quick Paste (no prompts)
