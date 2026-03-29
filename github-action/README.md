# PasteFox GitHub Action

> Part of [PasteFox Extensions](https://github.com/PasteFox/extensions) · [pastefox.com](https://pastefox.com)

Create pastes on PasteFox from your GitHub Actions workflows. Share build logs, test reports, error outputs, or any file.

## Usage

```yaml
- name: Share build log to PasteFox
  uses: PasteFox/extensions/github-action@main
  with:
    api-key: ${{ secrets.PASTEFOX_API_KEY }}
    file: build.log
    title: "Build Log - ${{ github.sha }}"
    visibility: UNLISTED
    expires: 7d
```

### Share content directly

```yaml
- name: Share test results
  uses: PasteFox/extensions/github-action@main
  with:
    api-key: ${{ secrets.PASTEFOX_API_KEY }}
    content: ${{ steps.tests.outputs.report }}
    title: "Test Report"
    language: markdown
```

### Use the output URL

```yaml
- name: Create paste
  id: paste
  uses: PasteFox/extensions/github-action@main
  with:
    api-key: ${{ secrets.PASTEFOX_API_KEY }}
    file: coverage/report.txt
    title: "Coverage Report"

- name: Comment on PR
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: `📊 Coverage report: ${{ steps.paste.outputs.url }}`
      })
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `api-key` | Yes | — | PasteFox API key (use secrets) |
| `content` | No* | — | Content to paste |
| `file` | No* | — | Path to file to paste |
| `title` | No | filename or "paste" | Paste title |
| `visibility` | No | `UNLISTED` | PUBLIC, UNLISTED, or PRIVATE |
| `language` | No | auto-detected | Language for syntax highlighting |
| `expires` | No | `never` | never, 10m, 1h, 1d, 7d, 30d |
| `instance-url` | No | `https://pastefox.com` | PasteFox URL or custom domain |

*Either `content` or `file` is required.

## Outputs

| Output | Description |
|--------|-------------|
| `url` | Full URL of the created paste |
| `slug` | Paste slug |
| `id` | Paste ID |

## Job Summary

The action automatically writes a summary to the GitHub Actions job summary with the paste URL, slug, visibility, and expiration.

## Setup

1. Get an API key from [pastefox.com/dashboard/api-keys](https://pastefox.com/dashboard/api-keys)
2. Add it as a repository secret: Settings → Secrets → `PASTEFOX_API_KEY`
3. Use the action in your workflow

## Other Extensions

- [VS Code / Kiro](../vscode) — share from your editor
- [Chrome Extension](../chrome) — share from Chrome
- [Firefox Extension](../firefox) — share from Firefox
- [IntelliJ Plugin](../intellij) — share from JetBrains IDEs
- [CLI](../cli) — share from the terminal

## License

MIT
