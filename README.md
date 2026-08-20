# Bible Illuminated

**A browser-based illuminated reading experience for the King James Bible.**

Bible Illuminated combines the typography and atmosphere of a traditional printed Bible with the speed, portability and navigation of a modern web application.

<img width="2839" height="1440" alt="Screenshot_20260820_200818_Gallery" src="https://github.com/user-attachments/assets/8d9017dd-5dac-41ba-9ec0-ddcf53b961c7" />


It is designed to feel like a book first and an application second.

## Live Application

https://bible-illuminated.barnestyson.workers.dev/

## Features

- King James Version reading experience
- 1611 edition support
- Complete book and chapter navigation
- Direct book, chapter and verse links
- Search and reference navigation
- Side-by-side verse comparison
- Illuminated chapter openings
- Folio-inspired reading presentation
- Reader typography controls
- Persistent reading position
- Bookmarks
- Shareable references
- Mobile and desktop layouts
- Progressive Web App support
- Service-worker-backed offline functionality
- Static deployment through Cloudflare Workers

## Example Reference

Genesis 36:1:

https://bible-illuminated.barnestyson.workers.dev/?book=Genesis&chapter=36&verse=1&edition=kjv

References are shareable through URL parameters:

`?book=Genesis&chapter=36&verse=1&edition=kjv`

## Philosophy

Bible Illuminated is intentionally different from a conventional Bible application. The interface aims to preserve visual hierarchy, generous typography, chapter identity, reading continuity, the atmosphere of a physical folio, and minimal distraction.

Modern controls remain available without dominating the text itself.

## Technology

Bible Illuminated is deliberately lightweight:

- HTML
- CSS
- Vanilla JavaScript
- Progressive Web App technologies
- Service Workers
- Cloudflare Workers static assets
- GitHub source control and releases

## Documentation

- [Installation](INSTALL.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Testing](docs/TESTING.md)
- [Sources](SOURCES.md)

## Current Stable Release

**v1.0.0** — first stable public release.

Release commit: `da90596`

## Sources and Copyright

Biblical source material and application source code are separate works and may be subject to different licensing or copyright conditions. See [SOURCES.md](SOURCES.md).

## Licence

The software licence is intentionally not supplied by this documentation pack. Choose and populate the repository `LICENSE` separately before making licensing claims.

---

**Bible Illuminated — Scripture presented for reading, study and contemplation.**
