# Bible Illuminated Deployment

## Production Pipeline

Termux/local development → Git → GitHub `main` → Cloudflare build/deployment → production Worker.

Production URL:

https://bible-illuminated.barnestyson.workers.dev/

## Pre-push Checks

```bash
for file in assets/js/*.js; do
  node --check "$file" || exit 1
done

git diff --check
git status
```

## Publish

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

## Verify

```bash
curl -I https://bible-illuminated.barnestyson.workers.dev/
```

Then test a deep link such as:

https://bible-illuminated.barnestyson.workers.dev/?book=Genesis&chapter=36&verse=1&edition=kjv

Stable versions should receive semantic-version tags. Do not move an existing public release tag without a compelling reason.
