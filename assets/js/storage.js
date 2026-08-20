const PREFIX = "bible-illuminated";

export function saveState(state) {
  localStorage.setItem(
    `${PREFIX}-state`,
    JSON.stringify(state)
  );
}

export function loadState() {
  try {
    const raw = localStorage.getItem(
      `${PREFIX}-state`
    );

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadBookmarks() {
  try {
    return JSON.parse(
      localStorage.getItem(
        `${PREFIX}-bookmarks`
      ) || "[]"
    );
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks) {
  localStorage.setItem(
    `${PREFIX}-bookmarks`,
    JSON.stringify(bookmarks)
  );
}
