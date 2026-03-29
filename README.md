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
| [VS Code / Kiro](./vscode) | VS Code, Kiro, Cursor | ✅ Published | [Open VSX](https://open-vsx.org/extension/pastefox/pastefox) |
| [Chrome](./chrome) | Chrome, Edge, Brave | ✅ Ready | [Load unpacked](#chrome) |
| [IntelliJ](./intellij) | IntelliJ, WebStorm, PyCharm, GoLand | ✅ Ready | [Build from source](#intellij) |
| [CLI](./cli) | Terminal (any OS) | ✅ Ready | `npm i -g pastefox-cli` |

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
