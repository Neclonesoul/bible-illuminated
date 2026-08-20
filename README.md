<img width="2839" height="1440" alt="Screenshot_20260820_200818_Gallery" src="https://github.com/user-attachments/assets/8d9017dd-5dac-41ba-9ec0-ddcf53b961c7" />
# Bible Illuminated

**A modern digital Bible reader inspired by the beauty of historic illuminated and early printed Bibles.**

Bible Illuminated combines the typography and visual character of historic Scripture with fast modern navigation, responsive reading, verse comparison, search, bookmarks, shareable references and offline support.

> **Current stable release: v1.1.2**

## Live Reader

**Bible Illuminated**

https://bible-illuminated.barnestyson.workers.dev/

A reference can be opened directly through the URL:

```text
?book=John&chapter=3&verse=16&edition=kjv
```

Example:

```text
https://bible-illuminated.barnestyson.workers.dev/?book=John&chapter=3&verse=16&edition=kjv
```

---

## Features

### Bible Reader

- Complete King James Version
- KJV 1611 edition support
- Book and chapter navigation
- Previous and next chapter controls
- Direct verse references
- Shareable reference URLs
- Responsive phone, tablet and desktop layouts
- Offline Scripture library
- Installable PWA

### Illuminated Presentation

Bible Illuminated takes visual inspiration from historic Bible printing while remaining practical on modern screens.

Three reading appearances are available:

**Folio**
An illuminated historical presentation with ornamental typography and traditional page treatment.

**Reading**
A simplified, highly legible reading surface.

**Nocturne**
A dark reading environment designed for comfortable low-light use.

Chapter openings use ornamental typography and illuminated initials while remaining responsive across different display sizes.

### Responsive Typography

The reader adapts its typography to the available screen rather than simply scaling the complete interface.

The v1.1 series introduced:

- length-aware Bible book titles
- improved long-title handling
- narrow-screen layout protection
- responsive reader typography
- Small / Medium / Large text settings
- independent comparison typography
- improved portrait and landscape layouts

Long titles such as **Ecclesiastes**, **Deuteronomy** and **Thessalonians** automatically scale to remain within the illuminated page while shorter titles retain their larger ceremonial treatment.

### Verse Comparison

Individual verses can be opened in a dedicated comparison interface.

Comparison features include:

- focused verse presentation
- edition comparison
- normal and compact density
- narrow-screen responsive layout
- typography isolated from normal reader scaling

### Reading Display

The `Aa` display control provides:

- Small / Medium / Large reader text
- Folio / Reading / Nocturne appearance
- comparison-density controls
- persistent preferences
- accessible active-state semantics
- keyboard Escape support
- focus restoration

### Search

Search Scripture directly from the application and open matching references immediately in the reader.

### Bookmarks

References can be saved locally and reopened later.

### Shareable References

Reader state is encoded in the URL, allowing a particular book, chapter, verse and edition to be shared directly.

### Offline Reading

Bible Illuminated includes service-worker support and an offline Scripture library.

The Bible can be stored locally for use when an Internet connection is unavailable.

---

## v1.1.2

The v1.1 release series focused on mobile reliability, responsive typography, appearance stability and production deployment.

Major improvements include:

- fixed long Bible book titles on mobile
- added length-aware chapter-title scaling
- hardened narrow-screen layouts
- refined reader typography across screen sizes
- stabilised comparison typography
- isolated comparison scaling from reader scaling
- improved compact comparison mode
- consolidated Folio, Reading and Nocturne appearance state
- hardened persisted appearance settings
- improved Reading Display accessibility
- added accessible pressed-state handling
- added expanded-state handling to the display control
- added Escape-to-close behaviour
- added focus restoration
- removed obsolete theme-handler conflicts
- improved source/public asset parity checks
- refreshed the service-worker cache for updated interface assets

The release was tested against long and short Bible titles, multiple appearance modes, typography sizes, KJV/KJV 1611, comparison mode, navigation, search, bookmarks and direct references.

See [CHANGELOG.md](CHANGELOG.md) for project history.

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

The `assets/` directory contains application source assets.

The `public/` directory contains the corresponding production assets served by Cloudflare.

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

See [INSTALL.md](INSTALL.md) for additional setup information.

---

## Deployment

Production is deployed using Cloudflare Workers.

Configuration is stored in:

```text
wrangler.jsonc
```

Production assets are served from:

```text
./public
```

The project uses a release-oriented Git workflow:

```text
feature / fix branch
        ↓
development branch
        ↓
release candidate
        ↓
main
        ↓
stable version
        ↓
production
```

`main` represents the stable production line.

---

## Releases

Bible Illuminated follows semantic versioning:

```text
vMAJOR.MINOR.PATCH
```

Stable examples:

```text
v1.0.0
v1.1.0
v1.1.1
v1.1.2
```

Release candidates use identifiers such as:

```text
v1.1.0-rc.1
```

Stable versions are released only after automated validation and browser/device acceptance testing.

---

## Quality Assurance

Release validation includes:

- JavaScript syntax checking
- source/public asset parity
- Git whitespace validation
- responsive-layout testing
- long Bible book-title testing
- appearance-state testing
- typography persistence
- comparison-mode testing
- KJV and KJV 1611 operation
- search
- bookmarks
- navigation
- shareable references
- mobile portrait testing
- mobile landscape testing
- production deployment verification

---

## Documentation

Project documentation includes:

- [INSTALL.md](INSTALL.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [SECURITY.md](SECURITY.md)
- [SOURCES.md](SOURCES.md)
- [CHANGELOG.md](CHANGELOG.md)
- [docs/](docs/)

---

## Scripture Sources

Bible text provenance and source information are documented separately in [SOURCES.md](SOURCES.md).

Scripture source material is not represented as original project authorship.

---

## License

Application source code is licensed under the **MIT License**.

See [LICENSE](LICENSE) for the complete terms.

Bible text, historical source material and other third-party material remain subject to their respective source terms as documented in [SOURCES.md](SOURCES.md).

---

## Project Status

| | |
|---|---|
| **Stable Release** | v1.1.2 |
| **Production** | Live |
| **Platform** | Web / PWA |
| **Deployment** | Cloudflare Workers |
| **Primary Editions** | KJV / KJV 1611 |
| **Status** | Active development |

Bible Illuminated is designed to make one of the world's most historically significant texts feel at home in both the tradition of the printed Bible and the modern web.
