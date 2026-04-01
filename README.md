<p align="center">
  <img src="https://pastefox.com/PasteFox_1084x1084_icon.png" width="80" height="80" alt="PasteFox" style="border-radius: 16px;">
</p>

<h1 align="center">PasteFox Extensions</h1>

<p align="center">
  Official extensions for <a href="https://pastefox.com">PasteFox</a> — share code and text snippets from your favorite tools.
</p>

<p align="center">
  <a href="https://pastefox.com">Website</a> · <a href="https://pastefox.com/docs/api">API Docs</a> · <a href="https://github.com/PasteFox/extensions/issues">Report a Bug</a>
</p>

---

## Extensions

| Extension | Platform | Status | Install |
|-----------|----------|--------|---------|
| [VS Code / Kiro](./vscode) | VS Code, Kiro, Cursor | ✅ Published | [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=PasteFox.pastefox) · [Open VSX](https://open-vsx.org/extension/pastefox/pastefox) |
| [Chrome](./chrome) | Chrome, Edge, Brave | ✅ Ready | [Load unpacked](#chrome) |
| [Firefox](./firefox) | Firefox | ✅ Published | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pastefox/) |
| [IntelliJ](./intellij) | IntelliJ, WebStorm, PyCharm, GoLand | ✅ Ready | [Build from source](#intellij) |
| [CLI](./cli) | Terminal (any OS) | ✅ Ready | `npm i -g pastefox-cli` |
| [GitHub Action](./github-action) | GitHub Actions | ✅ Ready | [Usage](#github-action) |

---

## VS Code / Kiro

Share code directly from your editor. Right-click selection, use the command palette, or click the status bar button.

```
ext install pastefox.pastefox
```

→ [Full documentation](./vscode/README.md)

## Chrome

Right-click any selected text on a webpage to share it to PasteFox. Includes a popup editor with visibility and expiration controls.

**Install locally:**
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" → select the `chrome/` folder

→ [Full documentation](./chrome/README.md)

## IntelliJ

Works with all JetBrains IDEs. Right-click in the editor or project tree → PasteFox → Share.

**Build from source:**
```bash
cd intellij
./gradlew buildPlugin
```
Plugin ZIP will be in `build/distributions/`. Install via Settings → Plugins → Install from Disk.

→ [Full documentation](./intellij/README.md)

## Firefox

Same features as the Chrome extension, built for Firefox. Right-click selected text to share, or use the popup.

**Install from Firefox Add-ons:**

→ [addons.mozilla.org/firefox/addon/pastefox](https://addons.mozilla.org/en-US/firefox/addon/pastefox/)

**Install locally (for testing):**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from the `firefox/` folder

→ [Full documentation](./firefox/README.md)

## CLI

Share pastes from your terminal. Pipe content, upload files, list and manage pastes.

```bash
npm install -g pastefox-cli

pastefox login pk_your_key
pastefox create myfile.py
cat error.log | pastefox create --title "Logs" --expires 1h
pastefox list
pastefox get abc123 > output.py
```

→ [Full documentation](./cli/README.md)

## GitHub Action

Create pastes from your CI/CD workflows. Share build logs, test reports, or any file.

```yaml
- uses: PasteFox/extensions/github-action@main
  with:
    api-key: ${{ secrets.PASTEFOX_API_KEY }}
    file: build.log
    title: "Build Log"
    expires: 7d
```

→ [Full documentation](./github-action/README.md)

---

## Getting Started

All extensions require a PasteFox API key:

1. Create a free account at [pastefox.com](https://pastefox.com)
2. Go to [Dashboard → API Keys](https://pastefox.com/dashboard/api-keys)
3. Create a key and paste it into the extension settings

## Custom Domains

If you have a custom domain configured on PasteFox, you can set it as the instance URL in any extension. Pastes will be created and opened via your custom domain.

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork this repository
2. Create a branch for your feature or fix (`git checkout -b my-feature`)
3. Make your changes in the relevant extension folder
4. Test locally
5. Submit a pull request

Please follow the existing code style and include a clear description of your changes.

## Issues

Found a bug or have a feature request? [Open an issue](https://github.com/PasteFox/extensions/issues) and include:

- Which extension (VS Code, Chrome, IntelliJ)
- Steps to reproduce
- Expected vs actual behavior
- Extension version and platform

## License

MIT — see [LICENSE](./vscode/LICENSE) for details.
