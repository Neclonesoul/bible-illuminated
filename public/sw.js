const VERSION = "bible-illuminated-v0.1.4";

const SHELL_CACHE = `${VERSION}-shell`;
const DATA_CACHE = `${VERSION}-data`;

const SHELL = [
  "/",
  "/index.html",
  "/app.webmanifest",

  "/assets/css/main.css",
  "/assets/css/folio.css",
  "/assets/css/reader.css",
  "/assets/css/compare.css",

  "/assets/js/app.js",
  "/assets/js/bible.js",
  "/assets/js/search.js",

  "/assets/icons/icon.svg",

  "/data/kjv/index.json",
  "/data/kjv1611/index.json",

  "/data/kjv/search.json",
  "/data/kjv1611/search.json"
];

self.addEventListener(
  "install",
  event => {
    event.waitUntil(
      caches
        .open(SHELL_CACHE)
        .then(cache =>
          cache.addAll(SHELL)
        )
        .then(() =>
          self.skipWaiting()
        )
    );
  }
);

self.addEventListener(
  "activate",
  event => {
    event.waitUntil(
      caches
        .keys()
        .then(keys =>
          Promise.all(
            keys
              .filter(
                key =>
                  key !== SHELL_CACHE &&
                  key !== DATA_CACHE
              )
              .map(key =>
                caches.delete(key)
              )
          )
        )
        .then(() =>
          self.clients.claim()
        )
    );
  }
);

self.addEventListener(
  "fetch",
  event => {
    const request = event.request;

    if (request.method !== "GET") {
      return;
    }

    const url =
      new URL(request.url);

    if (url.origin !== self.location.origin) {
      return;
    }

    // Bible JSON:
    // cache-first, then network.
    if (url.pathname.startsWith("/data/")) {
      event.respondWith(
        caches
          .open(DATA_CACHE)
          .then(async cache => {
            const cached =
              await cache.match(request);

            if (cached) {
              return cached;
            }

            const response =
              await fetch(request);

            if (response.ok) {
              cache.put(
                request,
                response.clone()
              );
            }

            return response;
          })
      );

      return;
    }

    // Application shell:
    // cache-first.
    event.respondWith(
      caches
        .match(request)
        .then(cached => {
          if (cached) {
            return cached;
          }

          return fetch(request)
            .then(response => {
              if (!response.ok) {
                return response;
              }

              const copy =
                response.clone();

              caches
                .open(SHELL_CACHE)
                .then(cache =>
                  cache.put(
                    request,
                    copy
                  )
                );

              return response;
            });
        })
    );
  }
);

self.addEventListener("message", event => {
  if (!event.data) {
    return;
  }

  if (event.data.type === "CACHE_OFFLINE_LIBRARY") {
    event.waitUntil(
      cacheOfflineLibrary(event.source)
    );
  }
});

async function cacheOfflineLibrary(client) {
  const cache = await caches.open(DATA_CACHE);

  const editions = [
    "kjv",
    "kjv1611"
  ];

  let urls = [];

  for (const edition of editions) {
    const response = await fetch(
      `/data/${edition}/index.json`
    );

    if (!response.ok) {
      throw new Error(
        `Unable to load ${edition} index`
      );
    }

    const books = await response.json();

    urls.push(
      `/data/${edition}/index.json`,
      `/data/${edition}/search.json`
    );

    for (const book of books) {
      urls.push(
        `/data/${edition}/${book.slug}.json`
      );
    }
  }

  let completed = 0;

  for (const url of urls) {
    const request = new Request(url);

    const existing =
      await cache.match(request);

    if (!existing) {
      const response = await fetch(request);

      if (!response.ok) {
        throw new Error(
          `Unable to cache ${url}`
        );
      }

      await cache.put(
        request,
        response.clone()
      );
    }

    completed++;

    client?.postMessage({
      type: "OFFLINE_LIBRARY_PROGRESS",
      completed,
      total: urls.length
    });
  }

  client?.postMessage({
    type: "OFFLINE_LIBRARY_COMPLETE",
    total: urls.length
  });
}
