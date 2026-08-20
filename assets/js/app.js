import {
  loadBookIndex,
  loadChapter
} from "./bible.js";

import { searchBible } from "./search.js";

const state = {
  edition: "kjv1611",
  book: "John",
  chapter: 3,
  verse: 16,
  mode: "read"
};

const scripture = document.querySelector("#scripture");
const editionButton = document.querySelector("#editionButton");
const compareButton = document.querySelector("#compareButton");
const previousChapter = document.querySelector("#previousChapter");
const nextChapter = document.querySelector("#nextChapter");
const themeButton = document.querySelector("#themeButton");
const booksButton = document.querySelector("#booksButton");

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

function renderVerses(verses) {
  scripture.replaceChildren();

  for (const verse of verses) {
    const span = document.createElement("span");

    span.className = "verse";
    span.tabIndex = 0;
    span.dataset.verse = verse.v;

    const number = document.createElement("sup");
    number.className = "verse-number";
    number.textContent = verse.v;

    span.append(number);

    span.append(
      document.createTextNode(
        decodeEntities(verse.t) + " "
      )
    );

    span.addEventListener("click", () => {
      openVerseComparison(verse.v);
    });

    span.addEventListener("keydown", event => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openVerseComparison(verse.v);
      }
    });

    scripture.append(span);
  }
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

themeButton.addEventListener(
  "click",
  () => {
    document.body.classList.toggle(
      "nocturne"
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
