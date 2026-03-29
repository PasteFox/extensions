# PasteFox for JetBrains IDEs

Share code snippets directly from IntelliJ IDEA, WebStorm, PyCharm, and all JetBrains IDEs to [PasteFox](https://pastefox.com).

## Features

- **Share Selection** — select code, right-click → PasteFox → Share Selection (`Ctrl+Shift+U`)
- **Share File** — right-click any file → PasteFox → Share File
- **Open Paste** — fetch any paste by slug or URL into a new editor tab
- **Visibility Control** — Public, Unlisted, or Private
- **Expiration** — 10m, 1h, 1d, 7d, 30d, or never
- **Clipboard** — URL copied automatically
- **Custom Domains** — works with PasteFox custom domains
- **Settings Panel** — configure API key and preferences under Settings > Tools > PasteFox

## Setup

1. Install the plugin
2. Go to Settings > Tools > PasteFox
3. Enter your API key (from [pastefox.com/dashboard/api-keys](https://pastefox.com/dashboard/api-keys))
4. Start sharing

## Build

```bash
./gradlew buildPlugin
```

The plugin ZIP will be in `build/distributions/`.

## Compatibility

- IntelliJ IDEA 2024.1+
- All JetBrains IDEs (WebStorm, PyCharm, GoLand, Rider, CLion, etc.)
