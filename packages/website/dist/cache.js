(() => {
  const buildVersion = 'msbsy16p';
  const cacheNamePrefix = 'codeplayer-website-assets-';
  const cacheName = `${cacheNamePrefix}${buildVersion}`;
  const configuredBase =
    'https://cdn.jsdelivr.net/gh/zh-lx/codeplayer/packages/website/dist/';
  const currentScript = document.currentScript;
  const scriptBase =
    currentScript instanceof HTMLScriptElement
      ? new URL('.', currentScript.src).href
      : '';
  const isLocalBase = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\//.test(
    scriptBase
  );
  const assetBases = [configuredBase, isLocalBase ? scriptBase : ''].filter(
    Boolean
  );
  const isLocalDevelopment =
    typeof location !== 'undefined' &&
    /^(?:localhost|127\.0\.0\.1)$/.test(location.hostname);
  const originalFetch = globalThis.fetch?.bind(globalThis);
  let cachePromise;
  const inFlight = new Map();

  if (!originalFetch || typeof globalThis.caches === 'undefined') return;

  if (
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    typeof location !== 'undefined' &&
    (location.protocol === 'https:' || isLocalDevelopment)
  ) {
    // The registration URL must be same-origin. The production worker loads its
    // CDN-hosted implementation from the same-origin /sw.js loader.
    const serviceWorkerUrl = new URL('/sw.js', location.origin);
    if (!isLocalDevelopment) {
      serviceWorkerUrl.searchParams.set('v', buildVersion);
    }

    navigator.serviceWorker
      .register(serviceWorkerUrl.href, { updateViaCache: 'none' })
      .catch(() => undefined);
  }

  function isWebsiteAsset(url) {
    return assetBases.some((base) => url.startsWith(base));
  }

  function isImmutableAsset(url) {
    const path = new URL(url).pathname;
    return /(?:^|[-.])[0-9a-f]{8,}(?:\.|$)/i.test(path);
  }

  function getCache() {
    cachePromise ||= cleanupOldCaches()
      .then(() => globalThis.caches.open(cacheName))
      .catch(() => undefined);
    return cachePromise;
  }

  async function cleanupOldCaches() {
    try {
      const cacheNames = await globalThis.caches.keys();
      const staleCacheNames = cacheNames.filter(
        (name) =>
          name.startsWith(cacheNamePrefix) && name !== cacheName
      );
      await Promise.all(
        staleCacheNames.map((name) =>
          globalThis.caches.delete(name).catch(() => false)
        )
      );
    } catch {
      // Cache cleanup is an optimization; it must not block network requests.
    }
  }

  async function readCache(cache, request) {
    try {
      return await cache?.match(request);
    } catch {
      return undefined;
    }
  }

  async function writeCache(cache, request, response) {
    if (!cache || !response.ok) return;
    try {
      await cache.put(request, response.clone());
    } catch {
      // Browser storage is an optimization; keep the network response.
    }
  }

  async function cachedFetch(input, init) {
    const request = new Request(input, init);
    if (
      request.method !== 'GET' ||
      !isWebsiteAsset(request.url) ||
      request.cache === 'no-store'
    ) {
      return originalFetch(input, init);
    }

    const cache = await getCache();
    if (!cache) return originalFetch(input, init);

    const bypassRead = request.cache === 'no-cache' || request.cache === 'reload';
    const immutable = isImmutableAsset(request.url);
    if (!bypassRead && immutable) {
      const cached = await readCache(cache, request);
      if (cached) return cached;
    }

    const key = request.url;
    let requestPromise = inFlight.get(key);
    if (!requestPromise) {
      requestPromise = originalFetch(input, init)
        .then(async (response) => {
          await writeCache(cache, request, response);
          return response;
        })
        .catch(async (error) => {
          const stale = await readCache(cache, request);
          if (stale) return stale;
          throw error;
        })
        .finally(() => {
          inFlight.delete(key);
        });
      inFlight.set(key, requestPromise);
    }
    return requestPromise.then((response) => response.clone());
  }

  globalThis.fetch = cachedFetch;
})();
