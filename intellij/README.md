# PasteFox for JetBrains IDEs

> Part of [PasteFox Extensions](https://github.com/PasteFox/extensions) · [pastefox.com](https://pastefox.com)

Share code snippets directly from IntelliJ IDEA, WebStorm, PyCharm, GoLand, and all JetBrains IDEs.

## Install

Build from source:

```bash
cd intellij
./gradlew buildPlugin
```

Plugin ZIP will be in `build/distributions/`. Install via Settings → Plugins → Install from Disk.

## Setup

1. Install the plugin
2. Go to Settings → Tools → PasteFox
3. Enter your API key from [pastefox.com/dashboard/api-keys](https://pastefox.com/dashboard/api-keys)

## Features

- **Share Selection** — select code → right-click → PasteFox → Share Selection
- **Share File** — right-click any file → PasteFox → Share File
- **Open Paste** — fetch any paste by slug or URL into a new editor tab
- **Keyboard Shortcut** — `Ctrl+Shift+U` to share selection
- **Visibility Control** — Public, Unlisted, or Private
- **Expiration** — 10m, 1h, 1d, 7d, 30d, or never
- **Clipboard** — URL copied automatically
- **Browser** — opens paste in browser after creation
- **Custom Domains** — works with PasteFox custom domains
- **Skip Prompts** — option to use defaults without dialogs

## Settings

Settings → Tools → PasteFox:

| Setting | Default | Description |
|---------|---------|-------------|
| API Key | — | Your PasteFox API key |
| Instance URL | `https://pastefox.com` | PasteFox URL or custom domain |
| Default Visibility | UNLISTED | PUBLIC, UNLISTED, or PRIVATE |
| Default Expiration | never | 10m, 1h, 1d, 7d, 30d, or never |
| Open in browser | On | Open paste URL after creation |
| Copy to clipboard | On | Copy URL to clipboard |
| Skip prompts | Off | Use defaults without dialogs |

## Compatibility

- IntelliJ IDEA 2024.1+
- WebStorm, PyCharm, GoLand, Rider, CLion, PhpStorm, RubyMine, DataGrip

## Other Extensions

- [VS Code / Kiro](../vscode) — share from VS Code
- [Chrome Extension](../chrome) — share from Chrome
- [Firefox Extension](../firefox) — share from Firefox
- [CLI](../cli) — share from the terminal
- [GitHub Action](../github-action) — share from CI/CD workflows

## License

MIT
