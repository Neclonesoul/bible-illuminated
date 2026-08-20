import {
  loadBookIndex,
  loadChapter
} from "./bible.js";

import { searchBible } from "./search.js";
import { saveState, loadState, loadBookmarks, saveBookmarks } from "./storage.js";
import { parseRoute, updateRoute } from "./router.js";

const restoredState = loadState();

const routeState = parseRoute();

const state = {
  edition:
    routeState.edition ||
    restoredState?.edition ||
    "kjv1611",

  book:
    routeState.book ||
    restoredState?.book ||
    "John",

  chapter:
    routeState.chapter ||
    restoredState?.chapter ||
    3,

  verse:
    routeState.verse ||
    restoredState?.verse ||
    16,

  mode:
    restoredState?.mode ||
    "read"
};

const scripture = document.querySelector("#scripture");
const editionButton = document.querySelector("#editionButton");
const compareButton = document.querySelector("#compareButton");
const previousChapter = document.querySelector("#previousChapter");
const nextChapter = document.querySelector("#nextChapter");
const booksButton = document.querySelector("#booksButton");

const referenceButton = document.querySelector("#referenceButton");
const referenceOverlay = document.querySelector("#referenceOverlay");
const referenceBackdrop = document.querySelector("#referenceBackdrop");
const referenceClose = document.querySelector("#referenceClose");
const referenceForm = document.querySelector("#referenceForm");
const referenceInput = document.querySelector("#referenceInput");
const referenceStatus = document.querySelector("#referenceStatus");

const searchButton = document.querySelector("#searchButton");
const searchOverlay = document.querySelector("#searchOverlay");
const searchBackdrop = document.querySelector("#searchBackdrop");
const searchClose = document.querySelector("#searchClose");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const searchEdition = document.querySelector("#searchEdition");
const searchStatus = document.querySelector("#searchStatus");
const searchResults = document.querySelector("#searchResults");
const chapterHeading = document.querySelector("#chapterHeading");
const folioReference = document.querySelector("#folioReference");
const titleDescription = document.querySelector("#titleDescription");
const titleEdition = document.querySelector("#titleEdition");
const bookKicker = document.querySelector("#bookKicker");
const bookTitle = document.querySelector("#bookTitle");

const bookNavigator = document.querySelector("#navigator");
const navigatorBackdrop = document.querySelector("#navigatorBackdrop");
const navigatorClose = document.querySelector("#navigatorClose");
const navigatorEdition = document.querySelector("#navigatorEdition");

const bookStage = document.querySelector("#bookStage");
const chapterStage = document.querySelector("#chapterStage");

const bookGrid = document.querySelector("#bookGrid");
const chapterGrid = document.querySelector("#chapterGrid");

const selectedBookTitle = document.querySelector("#selectedBookTitle");
const backToBooks = document.querySelector("#backToBooks");

let activeBookEntry = null;

const roman = number => {
  const values = [
    [1000, "M"], [900, "CM"],
    [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"],
    [5, "V"], [4, "IV"],
    [1, "I"]
  ];

  let result = "";
  let value = number;

  for (const [n, symbol] of values) {
    while (value >= n) {
      result += symbol;
      value -= n;
    }
  }

  return result;
};

function decodeEntities(text) {
  const element = document.createElement("textarea");
  element.innerHTML = text;
  return element.value;
}


function historicalHeading(book) {
  const headings = {
    "Genesis": ["THE FIRST BOOK OF MOSES, CALLED", "GENESIS"],
    "Exodus": ["THE SECOND BOOK OF MOSES, CALLED", "EXODUS"],
    "Leviticus": ["THE THIRD BOOK OF MOSES, CALLED", "LEVITICUS"],
    "Numbers": ["THE FOURTH BOOK OF MOSES, CALLED", "NUMBERS"],
    "Deuteronomy": ["THE FIFTH BOOK OF MOSES, CALLED", "DEUTERONOMY"],

    "Matthew": ["THE GOSPEL ACCORDING TO", "S. MATTHEW"],
    "Mark": ["THE GOSPEL ACCORDING TO", "S. MARK"],
    "Luke": ["THE GOSPEL ACCORDING TO", "S. LUKE"],
    "John": ["THE GOSPEL ACCORDING TO", "S. IOHN"],

    "Acts": ["THE ACTS OF THE", "APOSTLES"],
    "Romans": ["THE EPISTLE OF PAUL THE APOSTLE TO THE", "ROMANS"],
    "Revelation": ["THE REVELATION OF", "S. IOHN THE DIVINE"]
  };

  if (headings[book]) {
    return headings[book];
  }

  return ["THE BOOK OF", book.toUpperCase()];
}

function historicalBookName(book) {
  if (
    state.edition === "kjv1611" &&
    book.toLowerCase() === "john"
  ) {
    return "IOHN";
  }

  return book.toUpperCase();
}

function openVerseComparison(number) {
  state.verse = Number(number);
  state.mode = "compare";
  render();
}

function splitOpeningText(text) {
  const decoded = decodeEntities(text);

  const match = decoded.match(/^(\s*¶?\s*)([A-Za-zÀ-ÿ])([\s\S]*)$/);

  if (!match) {
    return {
      prefix: "",
      initial: "",
      rest: decoded
    };
  }

  return {
    prefix: match[1],
    initial: match[2],
    rest: match[3]
  };
}

function renderVerses(verses) {
  scripture.replaceChildren();

  verses.forEach((verse, index) => {
    const span = document.createElement("span");

    span.className = "verse";
    span.tabIndex = 0;
    span.dataset.verse = verse.v;

    const number = document.createElement("sup");
    number.className = "verse-number";
    number.textContent = verse.v;

    span.append(number);

    const decoded =
      decodeEntities(verse.t);

    if (index === 0) {
      const opening =
        splitOpeningText(decoded);

      if (opening.prefix) {
        const prefix =
          document.createElement("span");

        prefix.className =
          "opening-mark";

        prefix.textContent =
          opening.prefix;

        span.append(prefix);
      }

      if (opening.initial) {
        const initial =
          document.createElement("span");

        initial.className =
          state.edition === "kjv1611"
            ? "illuminated-initial"
            : "drop-initial";

        initial.textContent =
          opening.initial;

        span.append(initial);

        span.append(
          document.createTextNode(
            opening.rest + " "
          )
        );
      } else {
        span.append(
          document.createTextNode(
            decoded + " "
          )
        );
      }
    } else {
      span.append(
        document.createTextNode(
          decoded + " "
        )
      );
    }

    span.addEventListener(
      "click",
      () => {
        openVerseComparison(verse.v);
      }
    );

    span.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openVerseComparison(verse.v);
        }
      }
    );

    scripture.append(span);
  });
}

function findVerse(verses, number) {
  return verses.find(
    v => Number(v.v) === Number(number)
  );
}

function makeVersePanel(title, edition, verse) {
  const panel = document.createElement("section");

  panel.className = "compare-panel";
  panel.dataset.edition = edition;

  const heading = document.createElement("h3");
  heading.textContent = title;

  const ref = document.createElement("div");

  ref.className = "compare-verse-reference";
  ref.textContent =
    `${state.book.toUpperCase()} ${state.chapter}:${state.verse}`;

  const text = document.createElement("p");

  text.className = "compare-focus-text";
  text.textContent = verse
    ? decodeEntities(verse.t)
    : "Verse unavailable in this edition.";

  panel.append(heading, ref, text);

  return panel;
}

async function renderComparison() {
  scripture.replaceChildren();

  const [kjv, old] = await Promise.all([
    loadChapter(
      "kjv",
      state.book,
      state.chapter
    ),
    loadChapter(
      "kjv1611",
      state.book,
      state.chapter
    )
  ]);

  const kjvVerse = findVerse(
    kjv.verses,
    state.verse
  );

  const oldVerse = findVerse(
    old.verses,
    state.verse
  );

  const wrapper = document.createElement("div");
  wrapper.className = "verse-compare-view";

  const heading = document.createElement("header");
  heading.className = "verse-compare-heading";

  const reference = document.createElement("div");
  reference.className = "verse-compare-reference";

  reference.textContent =
    `${state.book.toUpperCase()} ${state.chapter}:${state.verse}`;

  const sub = document.createElement("div");
  sub.className = "verse-compare-subtitle";
  sub.textContent =
    "KJV · VERSE COMPARISON · 1611";

  heading.append(reference, sub);

  const shell = document.createElement("div");
  shell.className = "compare-shell";

  shell.append(
    makeVersePanel(
      "KING JAMES VERSION",
      "kjv",
      kjvVerse
    ),
    makeVersePanel(
      "KING JAMES · 1611",
      "kjv1611",
      oldVerse
    )
  );

  const nav = document.createElement("div");
  nav.className = "verse-nav";

  const prev = document.createElement("button");
  prev.textContent = "‹ PREVIOUS VERSE";

  const next = document.createElement("button");
  next.textContent = "NEXT VERSE ›";

  prev.addEventListener("click", () => {
    if (state.verse > 1) {
      state.verse--;
      render();
    }
  });

  next.addEventListener("click", () => {
    const max = Math.max(
      kjv.verses.length,
      old.verses.length
    );

    if (state.verse < max) {
      state.verse++;
      render();
    }
  });

  nav.append(prev, next);

  wrapper.append(
    heading,
    shell,
    nav
  );

  scripture.append(wrapper);
}

async function render() {
  document.body.classList.toggle(
    "compare-mode",
    state.mode === "compare"
  );

  saveState(state);
  updateRoute(state, true);

  document.body.dataset.edition =
    state.edition;

  scripture.innerHTML =
    `<p class="loading">Opening the Book…</p>`;

  try {
    const romanChapter = roman(state.chapter);

    chapterHeading.textContent =
      `CHAP. ${romanChapter}.`;

    const [kicker, title] = historicalHeading(state.book);

    bookKicker.textContent = kicker;
    bookTitle.textContent = title;

    folioReference.textContent =
      `${historicalBookName(state.book)} ${romanChapter}`;

    editionButton.textContent =
      state.edition === "kjv1611"
        ? "1611"
        : "KJV";

    if (state.edition === "kjv1611") {
      titleDescription.innerHTML =
        "Conteyning the Old Teſtament,<br>AND THE NEW";

      titleEdition.textContent =
        "King James Bible · 1611";
    } else {
      titleDescription.innerHTML =
        "Containing the Old Testament,<br>AND THE NEW";

      titleEdition.textContent =
        "King James Version";
    }

    compareButton.textContent =
      state.mode === "compare"
        ? "READ"
        : "COMPARE";

    if (state.mode === "compare") {
      await renderComparison();
    } else {
      const chapter = await loadChapter(
        state.edition,
        state.book,
        state.chapter
      );

      renderVerses(chapter.verses);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {
    scripture.innerHTML =
      `<p class="loading">${error.message}</p>`;
  }
}


function closeSearch() {
  searchOverlay.hidden = true;
}

function openSearch() {
  searchOverlay.hidden = false;

  searchEdition.textContent =
    state.edition === "kjv1611"
      ? "KING JAMES · 1611"
      : "KING JAMES VERSION";

  searchStatus.textContent =
    "Search Bible text by word or phrase. Use book navigation for chapter and verse.";

  searchResults.replaceChildren();

  setTimeout(() => {
    searchInput.focus();
  }, 50);
}

let searchGeneration = 0;

async function performSearch(query) {
  const generation = ++searchGeneration;

  searchStatus.textContent =
    "Searching Bible text…";

  searchResults.replaceChildren();

  try {
    const results = await searchBible(
      state.edition,
      query,
      100
    );

    // Ignore an older search if another search started
    // before this one completed.
    if (generation !== searchGeneration) {
      return;
    }

    searchStatus.textContent =
      results.length === 100
        ? "Showing first 100 matches."
        : `${results.length} match${results.length === 1 ? "" : "es"}.`;

    const fragment =
      document.createDocumentFragment();

    // Defensive de-duplication by exact Bible reference.
    const seen = new Set();

    for (const result of results) {
      const key =
        `${result.book}|${result.chapter}|${result.verse}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);

      const button =
        document.createElement("button");

      button.className = "search-result";

      const reference =
        document.createElement("span");

      reference.className =
        "search-result-reference";

      reference.textContent =
        `${result.book.toUpperCase()} ${result.chapter}:${result.verse}`;

      const text =
        document.createElement("span");

      text.className =
        "search-result-text";

      text.textContent =
        decodeEntities(result.text);

      button.append(reference, text);

      button.addEventListener(
        "click",
        () => {
          state.book = result.book;
          state.chapter = result.chapter;
          state.verse = result.verse;
          state.mode = "read";

          closeSearch();

          render().then(() => {
            setTimeout(() => {
              const verse =
                scripture.querySelector(
                  `[data-verse="${result.verse}"]`
                );

              if (verse) {
                verse.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                });

                verse.focus({
                  preventScroll: true
                });
              }
            }, 100);
          });
        }
      );

      fragment.append(button);
    }

    // One DOM operation = no duplicated append race.
    searchResults.replaceChildren(fragment);

  } catch (error) {
    if (generation === searchGeneration) {
      searchStatus.textContent =
        error.message;
    }
  }
}


function parseReferenceInput(value) {
  const input = value.trim();

  const match =
    input.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);

  if (!match) {
    return null;
  }

  return {
    book: match[1].trim(),
    chapter: Number(match[2]),
    verse: match[3]
      ? Number(match[3])
      : 1
  };
}

async function openReference(value) {
  const parsed =
    parseReferenceInput(value);

  if (!parsed) {
    referenceStatus.textContent =
      "Use a reference such as John 3:16 or Psalms 23.";

    return false;
  }

  const books =
    await loadBookIndex(
      state.edition
    );

  const entry =
    books.find(
      item =>
        item.book.toLowerCase() ===
        parsed.book.toLowerCase()
    );

  if (!entry) {
    referenceStatus.textContent =
      "Book not found in this edition.";

    return false;
  }

  if (
    parsed.chapter < 1 ||
    parsed.chapter > entry.chapters
  ) {
    referenceStatus.textContent =
      "Chapter not found.";

    return false;
  }

  const chapter =
    await loadChapter(
      state.edition,
      entry.book,
      parsed.chapter
    );

  const verse =
    chapter.verses.find(
      item =>
        Number(item.v) ===
        parsed.verse
    );

  if (!verse) {
    referenceStatus.textContent =
      "Verse not found.";

    return false;
  }

  state.book = entry.book;
  state.chapter = parsed.chapter;
  state.verse = parsed.verse;
  state.mode = "read";

  referenceOverlay.hidden = true;

  await render();

  setTimeout(() => {
    const el =
      scripture.querySelector(
        `[data-verse="${state.verse}"]`
      );

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, 100);

  return true;
}

async function openNavigator() {
  bookNavigator.hidden = false;

  bookStage.hidden = false;
  chapterStage.hidden = true;

  navigatorEdition.textContent =
    state.edition === "kjv1611"
      ? "KJV 1611 · 80 BOOKS"
      : "KING JAMES VERSION · 66 BOOKS";

  const books = await loadBookIndex(
    state.edition
  );

  bookGrid.replaceChildren();

  for (const entry of books) {
    const button = document.createElement("button");

    button.className = "book-button";

    const label = document.createElement("span");
    label.textContent = entry.book;

    const meta = document.createElement("small");
    meta.textContent =
      `${entry.chapters} chapter${entry.chapters === 1 ? "" : "s"}`;

    button.append(label, meta);

    button.addEventListener("click", () => {
      showChapterStage(entry);
    });

    bookGrid.append(button);
  }
}

function showChapterStage(entry) {
  activeBookEntry = entry;

  bookStage.hidden = true;
  chapterStage.hidden = false;

  selectedBookTitle.textContent =
    entry.book.toUpperCase();

  chapterGrid.replaceChildren();

  for (
    let chapter = 1;
    chapter <= entry.chapters;
    chapter++
  ) {
    const button = document.createElement("button");

    button.className = "chapter-button";
    button.textContent = chapter;

    button.addEventListener("click", () => {
      state.book = entry.book;
      state.chapter = chapter;
      state.verse = 1;
      state.mode = "read";

      closeNavigator();
      render();
    });

    chapterGrid.append(button);
  }
}

function closeNavigator() {
  bookNavigator.hidden = true;
  activeBookEntry = null;
}

booksButton.addEventListener(
  "click",
  openNavigator
);

navigatorClose.addEventListener(
  "click",
  closeNavigator
);

navigatorBackdrop.addEventListener(
  "click",
  closeNavigator
);

backToBooks.addEventListener(
  "click",
  () => {
    bookStage.hidden = false;
    chapterStage.hidden = true;
  }
);

editionButton.addEventListener(
  "click",
  () => {
    if (state.mode === "compare") {
      state.mode = "read";
    }

    state.edition =
      state.edition === "kjv1611"
        ? "kjv"
        : "kjv1611";

    render();
  }
);

compareButton.addEventListener(
  "click",
  () => {
    state.mode =
      state.mode === "compare"
        ? "read"
        : "compare";

    render();
  }
);

previousChapter.addEventListener(
  "click",
  async () => {
    if (state.chapter > 1) {
      state.chapter--;
      state.verse = 1;
      state.mode = "read";
      render();
      return;
    }

    const books = await loadBookIndex(
      state.edition
    );

    const index = books.findIndex(
      item =>
        item.book.toLowerCase() ===
        state.book.toLowerCase()
    );

    if (index > 0) {
      const previous = books[index - 1];

      state.book = previous.book;
      state.chapter = previous.chapters;
      state.verse = 1;
      state.mode = "read";

      render();
    }
  }
);

nextChapter.addEventListener(
  "click",
  async () => {
    const books = await loadBookIndex(
      state.edition
    );

    const index = books.findIndex(
      item =>
        item.book.toLowerCase() ===
        state.book.toLowerCase()
    );

    if (index < 0) return;

    const current = books[index];

    if (state.chapter < current.chapters) {
      state.chapter++;
    } else if (index + 1 < books.length) {
      state.book = books[index + 1].book;
      state.chapter = 1;
    } else {
      return;
    }

    state.verse = 1;
    state.mode = "read";

    render();
  }
);



    themeButton.textContent =
      document.body.classList.contains(
        "nocturne"
      )
        ? "☀"
        : "☾";
  }
);

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape" &&
      !bookNavigator.hidden
    ) {
      closeNavigator();
    }
  }
);


searchButton.addEventListener(
  "click",
  openSearch
);

searchClose.addEventListener(
  "click",
  closeSearch
);

searchBackdrop.addEventListener(
  "click",
  closeSearch
);

searchForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const query =
      searchInput.value.trim();

    if (query) {
      performSearch(query);
    }
  }
);



referenceButton?.addEventListener(
  "click",
  () => {
    referenceOverlay.hidden = false;

    referenceInput.value =
      `${state.book} ${state.chapter}:${state.verse}`;

    setTimeout(() => {
      referenceInput.focus();
      referenceInput.select();
    }, 50);
  }
);

referenceClose?.addEventListener(
  "click",
  () => {
    referenceOverlay.hidden = true;
  }
);

referenceBackdrop?.addEventListener(
  "click",
  () => {
    referenceOverlay.hidden = true;
  }
);

referenceForm?.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    referenceStatus.textContent =
      "Opening reference…";

    await openReference(
      referenceInput.value
    );
  }
);

window.addEventListener(
  "popstate",
  () => {
    const route = parseRoute();

    if (route.book) {
      state.book = route.book;
    }

    if (route.chapter) {
      state.chapter = route.chapter;
    }

    if (route.verse) {
      state.verse = route.verse;
    }

    if (route.edition) {
      state.edition = route.edition;
    }

    render();
  }
);


render();

if ("serviceWorker" in window.navigator) {
  window.addEventListener(
    "load",
    () => {
      window.navigator.serviceWorker
        .register("/sw.js")
        .catch(error => {
          console.error(
            "Service worker registration failed:",
            error
          );
        });
    }
  );
}


const offlineLibraryButton =
  document.querySelector("#offlineLibraryButton");

const offlineLibraryStatus =
  document.querySelector("#offlineLibraryStatus");

async function getOfflineWorker() {
  if (!("serviceWorker" in window.navigator)) {
    return null;
  }

  try {
    const registration =
      await window.navigator.serviceWorker.ready;

    return (
      registration.active ||
      registration.waiting ||
      registration.installing
    );
  } catch {
    return null;
  }
}

offlineLibraryButton?.addEventListener(
  "click",
  async () => {
    offlineLibraryButton.disabled = true;

    offlineLibraryStatus.textContent =
      "Preparing offline library…";

    const worker =
      await getOfflineWorker();

    if (!worker) {
      offlineLibraryStatus.textContent =
        "Offline installation becomes available when Bible Illuminated is served securely over HTTPS.";

      offlineLibraryButton.textContent =
        "AVAILABLE AFTER INSTALLATION";

      offlineLibraryButton.disabled = false;
      return;
    }

    worker.postMessage({
      type: "CACHE_OFFLINE_LIBRARY"
    });
  }
);

if ("serviceWorker" in window.navigator) {
  window.navigator.serviceWorker.addEventListener(
    "message",
    event => {
      const data = event.data;

      if (!data) return;

      if (
        data.type ===
        "OFFLINE_LIBRARY_PROGRESS"
      ) {
        const percent =
          Math.round(
            (data.completed / data.total) * 100
          );

        offlineLibraryStatus.textContent =
          `Downloading complete library… ${percent}%`;
      }

      if (
        data.type ===
        "OFFLINE_LIBRARY_COMPLETE"
      ) {
        offlineLibraryStatus.textContent =
          "Complete KJV + KJV 1611 library stored on this device.";

        offlineLibraryButton.textContent =
          "OFFLINE LIBRARY INSTALLED";

        offlineLibraryButton.disabled = true;

        localStorage.setItem(
          "bible-illuminated-offline-library",
          "installed"
        );
      }
    }
  );
}

if (
  localStorage.getItem(
    "bible-illuminated-offline-library"
  ) === "installed"
) {
  offlineLibraryButton.textContent =
    "OFFLINE LIBRARY INSTALLED";

  offlineLibraryStatus.textContent =
    "Complete KJV + KJV 1611 library stored on this device.";

  offlineLibraryButton.disabled = true;
}

/* =========================================================
   DISPLAY SETTINGS
   ========================================================= */

const displayButton =
  document.querySelector("#displayButton");

const displayOverlay =
  document.querySelector("#displayOverlay");

const displayBackdrop =
  document.querySelector("#displayBackdrop");

const displayClose =
  document.querySelector("#displayClose");

const fontButtons =
  document.querySelectorAll("[data-font-size]");

const densityButtons =
  document.querySelectorAll("[data-density]");

function applyFontSize(size) {
  document.body.classList.remove(
    "text-small",
    "text-medium",
    "text-large"
  );

  document.body.classList.add(
    `text-${size}`
  );

  localStorage.setItem(
    "bible-illuminated-font-size",
    size
  );

  for (const button of fontButtons) {
    button.classList.toggle(
      "active",
      button.dataset.fontSize === size
    );
  }
}

function applyCompareDensity(density) {
  document.body.classList.toggle(
    "compare-compact",
    density === "compact"
  );

  localStorage.setItem(
    "bible-illuminated-compare-density",
    density
  );

  for (const button of densityButtons) {
    button.classList.toggle(
      "active",
      button.dataset.density === density
    );
  }
}

function openDisplaySettings() {
  displayOverlay.hidden = false;
}

function closeDisplaySettings() {
  displayOverlay.hidden = true;
}

displayButton?.addEventListener(
  "click",
  openDisplaySettings
);

displayClose?.addEventListener(
  "click",
  closeDisplaySettings
);

displayBackdrop?.addEventListener(
  "click",
  closeDisplaySettings
);

fontButtons.forEach(button => {
  button.addEventListener(
    "click",
    () => {
      applyFontSize(
        button.dataset.fontSize
      );
    }
  );
});

densityButtons.forEach(button => {
  button.addEventListener(
    "click",
    () => {
      applyCompareDensity(
        button.dataset.density
      );
    }
  );
});

applyFontSize(
  localStorage.getItem(
    "bible-illuminated-font-size"
  ) || "medium"
);

applyCompareDensity(
  localStorage.getItem(
    "bible-illuminated-compare-density"
  ) || "compact"
);

const pageStyleButtons =
  document.querySelectorAll("[data-page-style]");

function applyPageStyle(style) {
  document.body.classList.remove(
    "page-folio",
    "page-reading",
    "page-nocturne"
  );

  document.body.classList.add(
    `page-${style}`
  );

  localStorage.setItem(
    "bible-illuminated-page-style",
    style
  );

  for (const button of pageStyleButtons) {
    button.classList.toggle(
      "active",
      button.dataset.pageStyle === style
    );
  }
}

pageStyleButtons.forEach(button => {
  button.addEventListener(
    "click",
    () => {
      applyPageStyle(
        button.dataset.pageStyle
      );
    }
  );
});

applyPageStyle(
  localStorage.getItem(
    "bible-illuminated-page-style"
  ) || "folio"
);

/* =========================================================
   BOOKMARKS + SHARE
   ========================================================= */

const bookmarkButton =
  document.querySelector("#bookmarkButton");

const shareButton =
  document.querySelector("#shareButton");

const bookmarkOverlay =
  document.querySelector("#bookmarkOverlay");

const bookmarkBackdrop =
  document.querySelector("#bookmarkBackdrop");

const bookmarkClose =
  document.querySelector("#bookmarkClose");

const saveBookmarkButton =
  document.querySelector("#saveBookmarkButton");

const shareCurrentButton =
  document.querySelector("#shareCurrentButton");

const bookmarkList =
  document.querySelector("#bookmarkList");

function currentReference() {
  return {
    book: state.book,
    chapter: state.chapter,
    verse: state.verse || 1,
    edition: state.edition
  };
}

function renderBookmarks() {
  const bookmarks = loadBookmarks();

  bookmarkList.replaceChildren();

  if (bookmarks.length === 0) {
    const empty = document.createElement("p");
    empty.style.padding = "18px 14px";
    empty.style.color = "var(--muted-ink)";
    empty.textContent = "No bookmarks yet.";

    bookmarkList.append(empty);
    return;
  }

  for (const bookmark of bookmarks) {
    const row = document.createElement("div");
    row.className = "bookmark-item";

    const open = document.createElement("button");
    open.className = "bookmark-open";

    const reference = document.createElement("span");
    reference.className = "bookmark-reference";
    reference.textContent =
      `${bookmark.book.toUpperCase()} ${bookmark.chapter}:${bookmark.verse}`;

    const meta = document.createElement("span");
    meta.className = "bookmark-meta";
    meta.textContent =
      bookmark.edition === "kjv1611"
        ? "KJV 1611"
        : "KJV";

    open.append(reference, meta);

    open.addEventListener("click", async () => {
      state.book = bookmark.book;
      state.chapter = bookmark.chapter;
      state.verse = bookmark.verse;
      state.edition = bookmark.edition;
      state.mode = "read";

      bookmarkOverlay.hidden = true;

      await render();

      setTimeout(() => {
        scripture.querySelector(
          `[data-verse="${bookmark.verse}"]`
        )?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    });

    const remove =
      document.createElement("button");

    remove.className = "bookmark-remove";
    remove.textContent = "×";
    remove.setAttribute(
      "aria-label",
      "Remove bookmark"
    );

    remove.addEventListener("click", () => {
      const next =
        loadBookmarks().filter(item =>
          !(
            item.book === bookmark.book &&
            item.chapter === bookmark.chapter &&
            item.verse === bookmark.verse &&
            item.edition === bookmark.edition
          )
        );

      saveBookmarks(next);
      renderBookmarks();
    });

    row.append(open, remove);
    bookmarkList.append(row);
  }
}

function saveCurrentBookmark() {
  const bookmarks = loadBookmarks();
  const current = currentReference();

  const exists = bookmarks.some(item =>
    item.book === current.book &&
    item.chapter === current.chapter &&
    item.verse === current.verse &&
    item.edition === current.edition
  );

  if (!exists) {
    bookmarks.unshift(current);
    saveBookmarks(bookmarks);
  }

  renderBookmarks();
}

async function shareCurrentReference() {
  const url = window.location.href;

  const text =
    `${state.book} ${state.chapter}:${state.verse || 1} · ${
      state.edition === "kjv1611" ? "KJV 1611" : "KJV"
    }`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Bible Illuminated",
        text,
        url
      });

      return;
    }

    await navigator.clipboard.writeText(url);

    shareButton.textContent = "✓";

    setTimeout(() => {
      shareButton.textContent = "↗";
    }, 1200);

  } catch {
    /* User cancelled or clipboard unavailable. */
  }
}

bookmarkButton?.addEventListener(
  "click",
  () => {
    bookmarkOverlay.hidden = false;
    renderBookmarks();
  }
);

bookmarkClose?.addEventListener(
  "click",
  () => {
    bookmarkOverlay.hidden = true;
  }
);

bookmarkBackdrop?.addEventListener(
  "click",
  () => {
    bookmarkOverlay.hidden = true;
  }
);

saveBookmarkButton?.addEventListener(
  "click",
  saveCurrentBookmark
);

shareCurrentButton?.addEventListener(
  "click",
  shareCurrentReference
);

shareButton?.addEventListener(
  "click",
  shareCurrentReference
);
