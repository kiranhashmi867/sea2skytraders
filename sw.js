/* Sea2Sky Traders - service worker (used by the website and by the Android app)

   - Every page is loaded from the internet first, so a change made on the
     website also shows in the app. Nothing is frozen inside the app.
   - No internet, or the server has a problem: the last saved copy of that
     page is shown. If there is no saved copy, offline.html is shown.
   - A link to a page that does not exist: the visitor is taken to the home page.
   Photos, fonts and icons are left to the browser. */

const CACHE = "s2s-pages-v1";
const HOME_URL = "/";
const OFFLINE_URL = "/offline.html";
const HOME_KEY = self.location.origin + "/";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    await cache.add(new Request(HOME_URL, { cache: "reload" })).catch(() => {});
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith("s2s-") && name !== CACHE)
        .map((name) => caches.delete(name))
    );
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.mode !== "navigate" || request.method !== "GET") { return; }
  event.respondWith(loadPage(event));
});

/* One saved copy per page: "/" and "/index.html" are the same page, and
   whatever comes after "?" is ignored (shop.html?cat=... is still shop.html). */
function pageKey(requestUrl) {
  const url = new URL(requestUrl);
  const path = url.pathname.endsWith("/index.html")
    ? url.pathname.slice(0, -"index.html".length)
    : url.pathname;
  return url.origin + path;
}

async function loadPage(event) {
  const request = event.request;
  const key = pageKey(request.url);

  let response = null;
  try {
    response = (await event.preloadResponse) || (await fetch(request));
  } catch (error) {
    response = null; // no internet
  }

  const notFound = response !== null && response.status === 404;
  const serverError = response !== null && response.status >= 500;

  // Normal case: show the live page and keep a copy for later
  if (response !== null && !notFound && !serverError) {
    if (response.status === 200 && response.type === "basic" && !response.redirected) {
      const copy = response.clone();
      event.waitUntil(
        caches.open(CACHE).then((cache) => cache.put(key, copy)).catch(() => {})
      );
    }
    return response;
  }

  // The page does not exist: go to the home page
  if (notFound && new URL(request.url).pathname !== "/") {
    return Response.redirect(HOME_URL, 302);
  }

  // No internet or a server problem: saved copy first, offline page second
  try {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(key, { ignoreVary: true });
    if (saved) { return saved; }
    const offline = await cache.match(OFFLINE_URL, { ignoreVary: true });
    if (offline) { return offline; }
  } catch (error) {
    // saved copies cannot be read: use the short message below
  }

  return new Response(
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
    "<title>Sea2Sky Traders</title></head>" +
    "<body style=\"font:16px/1.6 system-ui,sans-serif;padding:24px\">" +
    "<p>This page can't be loaded right now. Please check your internet connection and try again.</p>" +
    "</body></html>",
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
