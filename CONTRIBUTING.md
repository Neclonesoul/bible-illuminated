# Contributing to Bible Illuminated

Bible Illuminated prioritises reading quality, simplicity and reliability.

## Workflow

```bash
git switch main
git pull --ff-only
git switch -c feature/your-change
```

## Principles

Changes should preserve readability, mobile usability, deep-link compatibility, offline behaviour, fast loading, semantic HTML and a minimal dependency surface.

Reader behaviour and visual redesigns should preferably be committed separately.

## Required Checks

```bash
for file in assets/js/*.js; do
  node --check "$file" || exit 1
done

git diff --check
```

## Pull Requests

Explain what changed, why it changed, how it was tested, and whether reader behaviour or production assets changed. Screenshots are encouraged for visible UI changes.

Do not introduce biblical text from an unknown or incompatible source. Document new textual sources in `SOURCES.md`.
