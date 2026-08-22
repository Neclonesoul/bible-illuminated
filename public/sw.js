const VERSION = "bible-illuminated-v1.2.0";

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
  "/assets/js/router.js",
  "/assets/js/search.js",
  "/assets/js/storage.js"
];


/* =========================================================
   INSTALL
   ========================================================= */

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


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener(
  "activate",
  event => {
    event.waitUntil(
      caches
        .keys()
        .then(keys =>
          Promise.all(
            keys
              .filter(key =>
                key.startsWith(
                  "bible-illuminated-"
                ) &&
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


/* =========================================================
   HELPERS
   ========================================================= */

async function cacheFirst(
  request,
  cacheName
) {
  const cache =
    await caches.open(cacheName);

  const cached =
    await cache.match(request);

  if (cached) {
    return cached;
  }

  const response =
    await fetch(request);

  if (response.ok) {
    await cache.put(
      request,
      response.clone()
    );
  }

  return response;
}


async function networkFirst(
  request,
  cacheName,
  fallback = null
) {
  const cache =
    await caches.open(cacheName);

  try {
    const response =
      await fetch(request);

    if (response.ok) {
      await cache.put(
        request,
        response.clone()
      );
    }

    return response;
  } catch {
    const cached =
      await cache.match(request);

    if (cached) {
      return cached;
    }

    if (fallback) {
      const fallbackResponse =
        await cache.match(fallback);

      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    throw new Error(
      "Network and cache unavailable"
    );
  }
}


/* =========================================================
   FETCH POLICY
   ========================================================= */

self.addEventListener(
  "fetch",
  event => {
    const request =
      event.request;

    if (request.method !== "GET") {
      return;
    }

    const url =
      new URL(request.url);

    if (
      url.origin !== self.location.origin
    ) {
      return;
    }

    /*
      Scripture data remains offline-first.
    */
    if (
      url.pathname.startsWith("/data/")
    ) {
      event.respondWith(
        cacheFirst(
          request,
          DATA_CACHE
        )
      );

      return;
    }

    /*
      HTML/navigation is network-first.
    */
    if (
      request.mode === "navigate"
    ) {
      event.respondWith(
        networkFirst(
          request,
          SHELL_CACHE,
          "/index.html"
        )
      );

      return;
    }

    /*
      App code/styles/manifest are network-first
      so online users receive new releases quickly.
    */
    if (
      url.pathname.startsWith("/assets/") ||
      url.pathname === "/app.webmanifest"
    ) {
      event.respondWith(
        networkFirst(
          request,
          SHELL_CACHE
        )
      );

      return;
    }

    event.respondWith(
      networkFirst(
        request,
        SHELL_CACHE
      )
    );
  }
);


/* =========================================================
   OFFLINE LIBRARY
   ========================================================= */

self.addEventListener(
  "message",
  event => {
    if (
      !event.data ||
      event.data.type !==
        "CACHE_OFFLINE_LIBRARY"
    ) {
      return;
    }

    event.waitUntil(
      cacheOfflineLibrary(
        event.source
      )
    );
  }
);


async function cacheOfflineLibrary(
  client
) {
  const cache =
    await caches.open(DATA_CACHE);

  const editions = [
    "kjv",
    "kjv1611"
  ];

  const urls = [];

  for (const edition of editions) {
    const indexUrl =
      `/data/${edition}/index.json`;

    const response =
      await fetch(indexUrl);

    if (!response.ok) {
      throw new Error(
        `Unable to load ${edition} index`
      );
    }

    const books =
      await response.json();

    urls.push(
      indexUrl,
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
    const request =
      new Request(url);

    const existing =
      await cache.match(request);

    if (!existing) {
      const response =
        await fetch(request);

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
      type:
        "OFFLINE_LIBRARY_PROGRESS",
      completed,
      total: urls.length
    });
  }

  client?.postMessage({
    type:
      "OFFLINE_LIBRARY_COMPLETE",
    total: urls.length
  });
}
