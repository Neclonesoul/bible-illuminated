const cache = new Map();

async function loadIndex(edition) {
  if (cache.has(edition)) {
    return cache.get(edition);
  }

  const response = await fetch(
    `/data/${edition}/search.json`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load ${edition} search index`
    );
  }

  const data = await response.json();

  cache.set(edition, data);

  return data;
}

export async function searchBible(
  edition,
  query,
  limit = 100
) {
  const normalized = query
    .trim()
    .toLocaleLowerCase();

  if (!normalized) {
    return [];
  }

  const records = await loadIndex(edition);

  const results = [];

  for (const record of records) {
    const [book, chapter, verse, text] = record;

    if (
      text
        .toLocaleLowerCase()
        .includes(normalized)
    ) {
      results.push({
        book,
        chapter,
        verse,
        text
      });

      if (results.length >= limit) {
        break;
      }
    }
  }

  return results;
}
