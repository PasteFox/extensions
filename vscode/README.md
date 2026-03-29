# PasteFox for VS Code / Kiro

Share code snippets directly from your editor to [PasteFox](https://pastefox.com).

## Features

- **Create Paste from Selection** — select code, right-click, share
- **Create Paste from File** — share the entire file
- **Open Paste** — fetch any paste by slug or URL into a new editor tab
- **Visibility Control** — choose Public, Unlisted, or Private per paste
- **Status Bar** — quick access button in the bottom bar
- **Secure** — API key stored in VS Code's encrypted secret storage

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
| `PasteFox: Open Paste by Slug` | Fetch a paste into a new editor tab |
| `PasteFox: Set API Key` | Configure your API key |
| `PasteFox: Set Instance URL` | Point to a self-hosted instance |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `pastefox.instanceUrl` | `https://pastefox.com` | PasteFox instance URL |
| `pastefox.defaultVisibility` | `UNLISTED` | Default visibility for new pastes |
| `pastefox.openInBrowser` | `true` | Open paste URL in browser after creation |

## Self-Hosted

If you run your own PasteFox instance, set the instance URL:

```
PasteFox: Set Instance URL → https://your-instance.com
```
