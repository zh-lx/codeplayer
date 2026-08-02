(() => {
  const cdnServiceWorkerUrl =
    'https://cdn.jsdelivr.net/gh/zh-lx/codeplayer/packages/website/dist/sw.js';
  const buildVersion = '__CODEPLAYER_BUILD_VERSION__';
  const runtimeLoadedKey = '__CODEPLAYER_SW_RUNTIME_LOADED__';
  const isLocalDevelopment = /^(?:localhost|127\.0\.0\.1)$/.test(
    self.location.hostname
  );

// Service Worker registration requires a same-origin script. In production,
// /sw.js is a same-origin loader and the actual implementation comes from CDN.
  if (!isLocalDevelopment && !self[runtimeLoadedKey]) {
    self[runtimeLoadedKey] = true;
    importScripts(
      `${cdnServiceWorkerUrl}?v=${encodeURIComponent(buildVersion)}`
    );
  } else {
    const cacheNamePrefix = 'codeplayer-website-assets-';
    const cacheName = `${cacheNamePrefix}${buildVersion}`;
    const assetBase =
      'https://cdn.jsdelivr.net/gh/zh-lx/codeplayer/packages/website/dist/';

    self.addEventListener('install', () => {
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(
        Promise.all([self.clients.claim(), cleanupOldCaches()])
      );
    });

    self.addEventListener('fetch', (event) => {
      const request = event.request;
      if (request.method !== 'GET' || !request.url.startsWith(assetBase)) {
        return;
      }

      event.respondWith(getCachedAsset(request));
    });

    async function getCachedAsset(request) {
      let cache;
      try {
        cache = await caches.open(cacheName);
      } catch {
        return fetch(request);
      }

      let cached;
      try {
        cached = await cache.match(request);
      } catch {
        return fetch(request);
      }

      if (isImmutableAsset(request.url) && cached) return cached;

      try {
        const response = await fetch(request);
        if (response.status === 200 || response.type === 'opaque') {
          await cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }

    function isImmutableAsset(url) {
      return /(?:^|[-.])[0-9a-f]{8,}(?:\.|$)/i.test(new URL(url).pathname);
    }

    async function cleanupOldCaches() {
      try {
        const cacheNames = await caches.keys();
        const staleCacheNames = cacheNames.filter(
          (name) =>
            name.startsWith(cacheNamePrefix) && name !== cacheName
        );
        await Promise.all(
          staleCacheNames.map((name) =>
            caches.delete(name).catch(() => false)
          )
        );
      } catch {
        // Cache cleanup is an optimization; keep the new worker active.
      }
    }
  }
})();
