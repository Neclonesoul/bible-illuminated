# Bible Illuminated Architecture

Bible Illuminated is a lightweight client-side Bible reader built primarily with HTML, CSS and vanilla JavaScript.

## Layers

- `index.html` — application shell
- `assets/js/` — application state, Bible access, routing, navigation, search, storage and rendering
- `assets/css/` — reader and interface presentation
- `public/` — production assets published by Cloudflare
- `sw.js` — service worker
- `app.webmanifest` — PWA manifest

## Routing

References use query parameters, for example:

`?book=Genesis&chapter=36&verse=1&edition=kjv`

This allows references to be bookmarked and shared without server-side routing.

## Persistence

Browser storage is used for suitable local state such as reading position and bookmarks. No mandatory account is required.

## Hosting

Cloudflare Workers static assets publish the `./public` directory according to `wrangler.jsonc`.

The architecture favours browser-native capabilities, a small dependency surface and long-term maintainability.
