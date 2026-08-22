<div align="center">

# ✦ Bible Illuminated ✦

### A modern digital Bible reader inspired by historic illuminated manuscripts and early printed Bibles

[![Stable Release](https://img.shields.io/badge/stable-v1.2.0-6d1c17?style=for-the-badge)](#version-120)
[![Platform](https://img.shields.io/badge/platform-Web%20%2F%20PWA-19140d?style=for-the-badge)](#project-status)
[![Deployment](https://img.shields.io/badge/deployment-Cloudflare%20Workers-f4ecd8?style=for-the-badge&labelColor=19140d&color=6d1c17)](#deployment)
[![License](https://img.shields.io/badge/code-MIT-756044?style=for-the-badge)](#licence)

**KJV · KJV 1611 · Offline · Installable · Responsive**

[**OPEN THE LIVE READER**](https://bible-illuminated.barnestyson.workers.dev/)

</div>

---

> **Bible Illuminated** presents the King James Version and the 1611-oriented text within a fast, responsive, installable Progressive Web Application. Its design seeks to recover qualities of traditional Scripture presentation while satisfying contemporary expectations of navigation, search, persistence, and offline availability.

> **Current stable release:** `v1.2.0`

---

## ✦ Principal Capabilities

| Reading | Navigation | Personal | PWA |
|---|---|---|---|
| KJV + KJV 1611 | Book & chapter navigator | Local bookmarks | Installable |
| Folio / Reading / Nocturne | Direct references | Persistent reading position | Offline Scripture library |
| Responsive typography | Previous / next chapter | Persistent display preferences | Automatic updates |
| Verse comparison | Shareable URLs | Quick Tour replay | Mobile / tablet / desktop |
| Word & phrase search | URL state | No account required | State-preserving upgrades |

---

## Live Application

The production instance is available at:

### **https://bible-illuminated.barnestyson.workers.dev/**

No account is required. Use it directly in the browser or install it as a Progressive Web App for a focused, standalone reading environment.

---

## Reading Scripture

Scripture may be reached by selecting a book and chapter through the navigator or by supplying a direct reference.

```text
?book=John&chapter=3&verse=16&edition=kjv
```

Example:

```text
https://bible-illuminated.barnestyson.workers.dev/?book=John&chapter=3&verse=16&edition=kjv
```

This makes individual passages both **bookmarkable** and **shareable**.

---

## Bible Editions

### King James Version

A modern-text presentation of the King James Bible.

### KJV 1611

A historical edition oriented toward the 1611 text, preserving—where the source material permits—the character of the early typography and orthography.

The active edition may be changed directly from the reader controls.

---

## Illuminated Presentation

Bible Illuminated draws upon historic Bible printing and manuscript conventions without compromising modern readability or navigational clarity.

### **Folio**
The signature presentation: ornamental typography, illuminated chapter openings, and a page treatment informed by traditional printed Bibles.

### **Reading**
A restrained, highly legible surface intended for sustained reading sessions.

### **Nocturne**
A dark environment designed for comfortable low-light use while retaining the application’s visual identity.

> Chapter openings, illuminated initials, and ornamental elements respond to available screen size rather than merely shrinking a fixed desktop composition.

---

## Responsive Typography

Typography adapts to the geometry of the reading surface.

- Length-aware Bible book titles
- Long-title protection
- Narrow-screen layout constraints
- Responsive reader typography
- Small / Medium / Large text settings
- Independent comparison typography
- Portrait and landscape support

Long titles such as **Ecclesiastes**, **Deuteronomy**, and **Thessalonians** automatically adjust to remain within the illuminated page area while shorter titles retain a more ceremonial scale.

---

## Navigation

| Control | Purpose |
|---|---|
| **Books & Chapters** | Browse the Bible and select a chapter |
| **Direct Reference** | Jump immediately to a passage such as `John 3:16` |
| **Chapter Navigation** | Move sequentially backward or forward |
| **URL Navigation** | Preserve book, chapter, verse, and edition in a shareable URL |

---

## Verse Comparison

Individual verses may be examined in a dedicated comparison interface.

- Focused verse presentation
- Edition comparison
- Normal and compact density options
- Responsive narrow-screen layout
- Typography independent of the main reader’s scaling preference

This separation keeps comparison legible even when the primary reader uses a larger text size.

---

## Word Search

Search Scripture directly from the application and open matching references immediately in the reader.

The search facility is designed to locate **words and phrases** within the available Bible text rather than provide theological or semantic retrieval.

---

## Bookmarks

References may be saved locally and reopened in later sessions.

Persistence is handled through browser local storage, so **no account or remote profile is required**.

---

## Reading Display

The **`Aa`** control opens Reading Display settings.

Available options include:

- Small / Medium / Large reader text
- Folio / Reading / Nocturne appearance
- Comparison density
- Persistent display preferences
- Quick Tour replay

The interface also incorporates keyboard Escape handling, focus restoration, and accessible active-state semantics.

---

## Quick Tour

Version `1.2.0` introduces contextual onboarding.

The Quick Tour explains the application’s actual controls:

1. Book and chapter navigation
2. Direct references
3. Word search
4. Reading Display
5. Bookmarks
6. Edition switching
7. Verse comparison
8. Chapter navigation

The tour operates independently of PWA installation availability and may be replayed at any time via:

```text
Aa → QUICK TOUR
```

---

## Installable Progressive Web App

When the host browser supports installation, Bible Illuminated first presents contextual information explaining the practical benefits before transferring control to the browser’s native install flow.

### Installation provides

- Home-screen or application-launcher access
- A standalone reading environment
- Rapid subsequent startup
- Persistence of local preferences
- Offline Scripture capability

> Installation is optional. The complete reader continues to function as a normal website.

---

## Offline Reading

A service worker and offline Scripture library are provided.

The architecture separates the **updateable application interface** from **persistent Scripture data**. Application code and styles can therefore receive newer releases while Bible text remains available for offline-first access.

---

## Automatic Updates

Version `1.2.0` introduces a more robust Progressive Web App update lifecycle.

```text
New release detected
        ↓
Background download
        ↓
Obsolete application caches replaced
        ↓
New service worker takes control
        ↓
Single interface refresh when required
```

Existing local user state is preserved independently, including:

- Bookmarks
- Reading position
- Text-size preference
- Page appearance
- Comparison preferences

Existing users therefore **do not need to reinstall** Bible Illuminated when a new release is published.

---

## Version 1.2.0

The `1.2` release concentrates on **installation, onboarding, and upgrade reliability**.

### Principal additions

- Contextual PWA install prompt
- Dimmed-focus install presentation
- Guided first-run tutorial
- Contextual guidance attached to live reader controls
- Back / Next / Skip tutorial navigation
- Permanent Quick Tour replay
- Tutorial support when native installation is unavailable
- Improved handling of already-installed PWAs
- Proactive service-worker update checks
- Automatic transition to newly activated application versions
- Versioned application caches
- Stale interface-cache cleanup
- Network-first application-shell updates
- Offline-first Scripture data
- Preservation of reader preferences during upgrades

The release was validated through automated repository checks and device/browser acceptance testing. See [`CHANGELOG.md`](CHANGELOG.md) for further detail.

---

## Project Structure

```text
bible-illuminated/
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── folio.css
│   │   ├── reader.css
│   │   └── compare.css
│   └── js/
│       ├── app.js
│       ├── bible.js
│       ├── router.js
│       ├── search.js
│       └── storage.js
├── data/
├── docs/
├── public/
├── index.html
├── app.webmanifest
├── sw.js
├── wrangler.jsonc
├── package.json
├── README.md
├── INSTALL.md
├── CONTRIBUTING.md
├── SECURITY.md
├── SOURCES.md
├── CHANGELOG.md
└── LICENSE
```

Source assets reside in `assets/`. The corresponding production assets served by Cloudflare are located in `public/`.

---

## Development

Clone the repository:

```bash
git clone https://github.com/Neclonesoul/bible-illuminated.git
cd bible-illuminated
```

Install development dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

Additional setup information is provided in [`INSTALL.md`](INSTALL.md).

---

## Deployment

Production deployment is performed with **Cloudflare Workers**.

Configuration:

```text
wrangler.jsonc
```

Production assets:

```text
./public
```

### Release workflow

```text
feature / fix branch
        ↓
development branch
        ↓
release candidate
        ↓
main
        ↓
stable release
        ↓
production
```

The `main` branch represents the stable production line.

---

## Releases

Bible Illuminated follows semantic versioning:

```text
vMAJOR.MINOR.PATCH
```

Stable releases to date:

- `v1.0.0`
- `v1.1.0`
- `v1.1.1`
- `v1.1.2`
- **`v1.2.0`**

Release candidates use suffixes such as `v1.2.0-rc.1`.

Stable versions are published only after validation and browser/device acceptance testing.

---

## Quality Assurance

Release validation encompasses:

- JavaScript syntax checking
- Service-worker syntax checking
- Source/public asset parity
- Git whitespace validation
- Responsive-layout testing
- Long Bible book-title testing
- Appearance-state testing
- Typography persistence
- Comparison-mode testing
- KJV and KJV 1611 operation
- Search
- Bookmarks
- Navigation
- Shareable references
- PWA installation
- First-run onboarding
- Quick Tour replay
- Service-worker migration
- Existing-user state preservation
- Offline behaviour
- Mobile portrait and landscape testing
- Production deployment verification

---

## Documentation

- [`INSTALL.md`](INSTALL.md)
- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`SECURITY.md`](SECURITY.md)
- [`SOURCES.md`](SOURCES.md)
- [`CHANGELOG.md`](CHANGELOG.md)
- [`docs/`](docs/)

---

## Scripture Sources

Bible text provenance and source information are documented separately in [`SOURCES.md`](SOURCES.md).

Scripture source material is not represented as original project authorship.

---

## Licence

Application source code is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for the complete terms.

Bible text, historical source material, and other third-party material remain subject to their respective source terms as documented in [`SOURCES.md`](SOURCES.md).

---

## Project Status

| Attribute | Value |
|---|---|
| **Stable Release** | `v1.2.0` |
| **Production** | Live |
| **Platform** | Web / PWA |
| **Deployment** | Cloudflare Workers |
| **Primary Editions** | KJV / KJV 1611 |
| **Offline** | Supported |
| **Installable** | Yes |
| **Status** | Active development |

---

<div align="center">

### ✦ Bible Illuminated ✦

*Seeking to place one of the world’s most historically significant texts within an environment that respects both the tradition of the printed Bible and the opportunities of the contemporary web.*

**[Open Bible Illuminated](https://bible-illuminated.barnestyson.workers.dev/)**

</div>
