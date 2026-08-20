export async function loadBookIndex(edition) {
  const response = await fetch(`/data/${edition}/index.json`);

  if (!response.ok) {
    throw new Error(`Unable to load ${edition} book index`);
  }

  return response.json();
}

export async function loadChapter(edition, book, chapter) {
  const index = await loadBookIndex(edition);

  const entry = index.find(
    item => item.book.toLowerCase() === book.toLowerCase()
  );

  if (!entry) {
    throw new Error(`${book} is unavailable in ${edition}`);
  }

  const response = await fetch(
    `/data/${edition}/${entry.slug}.json`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load ${book} ${chapter}`
    );
  }

  const data = await response.json();

  const verses = data.chapters[String(chapter)];

  if (!verses) {
    throw new Error(
      `${book} ${chapter} is unavailable`
    );
  }

  return {
    book: data.book,
    slug: data.slug,
    chapter,
    chapters: Object.keys(data.chapters).length,
    verses
  };
}
