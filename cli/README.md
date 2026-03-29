# PasteFox CLI

Share code and text snippets to [PasteFox](https://pastefox.com) from the command line.

## Install

```bash
npm install -g pastefox-cli
```

Or use without installing:

```bash
npx pastefox-cli create myfile.py
```

## Setup

```bash
pastefox login pk_your_api_key_here
```

Get your API key at [pastefox.com/dashboard/api-keys](https://pastefox.com/dashboard/api-keys).

## Usage

```bash
# Create paste from file
pastefox create main.py

# Pipe content
cat error.log | pastefox create --title "Error log" --expires 1h

# Create private paste
pastefox create secret.txt -v private -e 1d

# Fetch paste content
pastefox get abc123

# Save paste to file
pastefox get abc123 > output.py

# List your pastes
pastefox list

# Delete a paste
pastefox delete abc123

# View/update config
pastefox config
pastefox config --url https://paste.yourdomain.com
pastefox config --visibility PRIVATE --expires 7d
```

## Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `create <file>` | `c`, `new`, `push` | Create a paste from a file or stdin |
| `get <slug>` | `g`, `fetch`, `read` | Fetch paste content (stdout) |
| `list` | `ls`, `l` | List your pastes |
| `delete <slug>` | `del`, `rm` | Delete a paste |
| `login <key>` | `auth` | Save your API key |
| `logout` | | Remove saved API key |
| `config` | `settings` | View or update settings |

## Create Options

| Flag | Short | Description |
|------|-------|-------------|
| `--title` | `-t` | Paste title |
| `--visibility` | `-v` | PUBLIC, UNLISTED, or PRIVATE |
| `--language` | `-l` | Language (auto-detected from extension) |
| `--expires` | `-e` | 10m, 1h, 1d, 7d, 30d, or never |

## Config

Settings are stored in `~/.pastefox/config.json`. You can also use environment variables:

- `PASTEFOX_API_KEY` — API key
- `PASTEFOX_URL` — Instance URL

## Custom Domains

```bash
pastefox config --url https://paste.yourdomain.com
```

## License

MIT
