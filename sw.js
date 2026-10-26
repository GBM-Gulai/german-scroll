/* Offline support: serve the app from cache, refresh the cache in the background.
   Bump VERSION when you want every phone to fetch fresh files immediately. */
const VERSION = "gs-6";
const FILES = ["./", "index.html", "style.css", "app.js", "content.js", "content/a1.js", "content/a2.js", "content/b1.js", "content/b2.js", "content/c1.js", "content/c2.js",
  "manifest.webmanifest", "icon.svg"];

// cache: "reload" skips the browser's HTTP cache, so a new version never stores stale copies of the files
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" }))))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(e.request);
    const fresh = fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) cache.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || fresh;
  }));
});
