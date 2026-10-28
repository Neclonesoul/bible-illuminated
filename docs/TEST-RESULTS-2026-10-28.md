# Internal testing — 28 October 2026

Status: partial; not approved for release.

## Completed

- Four automated regression tests pass: invalid numeric references, offline-download failure notification, indexed book/chapter completeness, and edited source/public parity.
- All deployed JavaScript files pass syntax checks; diff whitespace check passes.
- Data structure checks cover 66 KJV books and 80 historic 1611 books. This is not a textual accuracy audit.
- Live browser: John 3 in the 1611 edition renders; next chapter navigates to John 4 with the correct URL and content.
- Production Digital Asset Links JSON is reachable and names uk.co.tysonbarnes.bibleilluminated. Certificate matching to Google Play App Signing remains unverified.

## Fixes prepared

- Interrupted library downloads report an error and allow retry, retaining cached books.
- Fractional and unsafe chapter/verse numbers are rejected by URL parsing.
- npm test and GitHub Actions now run repeatable regression checks.

## Still required

- Browser acceptance: remaining deep links, previous chapter, edition switching, search, comparison, typography, bookmark persistence, sharing and mobile layout.
- Offline installation success, interrupted-download retry in a real browser, cold offline launch and network restoration.
- Android: install from the Play internal track, verify signing and toolbar-free TWA launch, back, rotation, background/reopen and offline behavior on a physical device.
- Play Console: verify internal release status, tester access, app-signing fingerprint and pre-launch report. No console inspection or Android device testing was performed; no device was connected.

Do not mark unchecked Android acceptance items as passed based on website or source tests.
