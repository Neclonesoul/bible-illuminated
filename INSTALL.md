# Bible Illuminated — Installation

Bible Illuminated is a lightweight browser application.

## Requirements

- Git
- Node.js
- npm
- A modern browser

## Android / Termux

```bash
pkg update
pkg upgrade
pkg install git nodejs
git clone https://github.com/Neclonesoul/bible-illuminated.git
cd bible-illuminated
npm install
```

## Local Testing

Serve the project through HTTP rather than opening `index.html` directly.

```bash
npx serve .
```

For Cloudflare development:

```bash
npm run dev
```

## Validation

Before committing:

```bash
for file in assets/js/*.js; do
  node --check "$file" || exit 1
done

git diff --check
git status
```
