export function parseRoute() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const book =
    params.get("book");

  const chapter =
    Number(params.get("chapter"));

  const verse =
    Number(params.get("verse"));

  const edition =
    params.get("edition");

  return {
    book,
    chapter:
      Number.isFinite(chapter) &&
      chapter > 0
        ? chapter
        : null,
    verse:
      Number.isFinite(verse) &&
      verse > 0
        ? verse
        : null,
    edition:
      edition === "kjv" ||
      edition === "kjv1611"
        ? edition
        : null
  };
}

export function updateRoute(
  state,
  replace = false
) {
  const params =
    new URLSearchParams();

  params.set(
    "book",
    state.book
  );

  params.set(
    "chapter",
    state.chapter
  );

  if (state.verse) {
    params.set(
      "verse",
      state.verse
    );
  }

  params.set(
    "edition",
    state.edition
  );

  const url =
    `${window.location.pathname}?${params.toString()}`;

  if (replace) {
    history.replaceState(
      {},
      "",
      url
    );
  } else {
    history.pushState(
      {},
      "",
      url
    );
  }
}
