// @ts-ignore
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import {
  createJsDelivrFs,
  createJsDelivrUriResolver,
  decorateServiceEnvironment,
  jsDelivrUriBase,
} from '@volar/cdn';
import { VueCompilerOptions, resolveConfig } from '@vue/language-service';
import {
  createLanguageService,
  createLanguageHost,
  createServiceEnvironment,
} from '@volar/monaco/worker';
import { setupTypeAcquisition } from '@typescript/ata';
import type { WorkerHost, WorkerMessage } from './env';

export interface CreateData {
  tsconfig: {
    compilerOptions?: import('typescript').CompilerOptions;
    vueCompilerOptions?: Partial<VueCompilerOptions>;
  };
  dependencies: Record<string, string>;
}

let locale: string;

let ts: typeof import('typescript');
let tsLocalized: any;

self.onmessage = async (msg: MessageEvent<WorkerMessage>) => {
  if (msg.data?.event === 'init') {
    if (msg.data.tsLocale) {
      locale = msg.data.tsLocale;
    }

    [ts, tsLocalized] = await Promise.all([
      importTsFromCdn(msg.data.tsVersion),
      locale &&
        fetchJson(
          `https://cdn.jsdelivr.net/npm/typescript@${msg.data.tsVersion}/lib/${locale}/diagnosticMessages.generated.json`,
        ),
    ]);
    self.postMessage('inited');
    return;
  }

  worker.initialize(
    (
      ctx: monaco.worker.IWorkerContext<WorkerHost>,
      { tsconfig, dependencies }: CreateData,
    ) => {
      const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
        tsconfig?.compilerOptions || {
          allowImportingTsExtensions: true,
          allowJs: true,
          checkJs: true,
          jsx: 'Preserve',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          target: 'ES6',
        },
        '',
      );
      const env = createServiceEnvironment();
      const host = createLanguageHost(
        ctx.getMirrorModels,
        env,
        '/',
        compilerOptions,
      );
      const typeFiles = new Map<string, string>();
      const typeFileDirectories = new Map<string, Map<string, 1 | 2>>();
      let typeFilesVersion = 0;
      const getScriptFileNames = host.getScriptFileNames.bind(host);
      const getScriptSnapshot = host.getScriptSnapshot.bind(host);
      const getProjectVersion = host.getProjectVersion.bind(host);
      host.getScriptFileNames = () => [
        ...getScriptFileNames(),
        ...[...typeFiles.keys()].filter(isTypeScriptFile),
      ];
      host.getScriptSnapshot = (fileName) =>
        getScriptSnapshot(fileName) ??
        (typeFiles.has(fileName)
          ? ts.ScriptSnapshot.fromString(typeFiles.get(fileName)!)
          : undefined);
      host.getProjectVersion = () =>
        `${getProjectVersion()}:${typeFilesVersion}`;
      const typeFileCache = createTypeFileCache(ctx.host.onFetchCdnFile);
      // @volar/cdn uses the global fetch directly, so route it through the
      // same persistent cache used by ATA.
      (globalThis as any).fetch = typeFileCache.fetch;
      const jsDelivrFs = createJsDelivrFs((uri, text) => {
        void typeFileCache.write(uri, text);
        typeFileCache.notify(uri, text);
      });
      const jsDelivrUriResolver = createJsDelivrUriResolver(
        '/node_modules',
        dependencies,
      );

      if (locale) {
        env.locale = locale;
      }
      if (tsLocalized) {
        host.getLocalizedDiagnosticMessages = () => tsLocalized;
      }

      decorateServiceEnvironment(env, jsDelivrUriResolver, jsDelivrFs);
      const fallbackFs = env.fs;
      env.fs = {
        async stat(uri) {
          const fileName = env.uriToFileName(uri);
          if (typeFiles.has(fileName)) {
            return { type: 1, size: -1, ctime: -1, mtime: -1 };
          }
          if (hasTypeFileInDirectory(fileName)) {
            return { type: 2, size: -1, ctime: -1, mtime: -1 };
          }
          if (await typeFileCache.has(uri)) {
            return { type: 1, size: -1, ctime: -1, mtime: -1 };
          }
          return fallbackFs?.stat(uri);
        },
        async readFile(uri) {
          const fileName = env.uriToFileName(uri);
          const typeFile = typeFiles.get(fileName);
          if (typeFile !== undefined) return typeFile;

          const cachedFile = await typeFileCache.read(uri);
          if (cachedFile !== undefined) {
            typeFileCache.notify(uri, cachedFile);
            return cachedFile;
          }

          const fetchedFile = await fallbackFs?.readFile(uri);
          if (fetchedFile !== undefined) {
            await typeFileCache.write(uri, fetchedFile);
          }
          return fetchedFile;
        },
        async readDirectory(uri) {
          const fileName = env.uriToFileName(uri);
          const typeEntries = readTypeFileDirectory(fileName);
          const cachedEntries = await typeFileCache.readDirectory(uri);
          const fallbackEntries: [string, number][] =
            (await fallbackFs?.readDirectory(uri)) ?? [];
          if (!typeEntries.length && !cachedEntries.length) {
            return fallbackEntries;
          }
          const mergedEntries = new Map<string, number>();
          for (const [name, type] of [...typeEntries, ...cachedEntries]) {
            const previousType = mergedEntries.get(name);
            mergedEntries.set(name, previousType === 2 || type === 2 ? 2 : 1);
          }
          const typeNames = new Set(mergedEntries.keys());
          return [
            ...mergedEntries,
            ...fallbackEntries.filter(([name]) => !typeNames.has(name)),
          ];
        },
      };

      const languageService = createLanguageService(
        { typescript: ts as any },
        env,
        resolveConfig(
          {},
          compilerOptions,
          tsconfig.vueCompilerOptions || {},
          ts as any,
        ),
        host,
      );
      let acquire = createTypeAcquisition();
      let acquisitionRun = Promise.resolve();
      const acquiredPackages = new Set<string>();
      const packageTypeAvailability = new Map<string, Promise<boolean>>();

      return Object.assign(languageService, {
        acquireTypes(source: string) {
          acquisitionRun = acquisitionRun
            .then(async () => {
              const previousFileCount = typeFiles.size;
              const packages = (await getPackagesWithoutTypes(source)).filter(
                (name) => !acquiredPackages.has(name),
              );
              if (packages.length) {
                await acquire(
                  packages
                    .map(
                      (name) =>
                        `import '${name}'; // types: ${
                          dependencies[name] || 'latest'
                        }`,
                    )
                    .join('\n'),
                );
                for (const packageName of packages) {
                  acquiredPackages.add(packageName);
                }
              }
              if (typeFiles.size > previousFileCount) {
                typeFilesVersion++;
              }
            })
            .catch((error) => {
              console.warn(
                '[codeplayer] Automatic type acquisition failed',
                error,
              );
              acquire = createTypeAcquisition();
            });
          return acquisitionRun;
        },
      });

      function createTypeAcquisition() {
        return setupTypeAcquisition({
          projectName: 'codeplayer',
          typescript: ts,
          fetcher: typeFileCache.fetch,
          delegate: {
            receivedFile(code, path) {
              addTypeFile(path, code);
            },
            errorMessage(message, error) {
              console.warn(`[codeplayer] ${message}`, error);
            },
          },
        });
      }

      function hasTypeFileInDirectory(directory: string) {
        return typeFileDirectories.has(normalizeDirectory(directory));
      }

      function readTypeFileDirectory(directory: string) {
        return Array.from(
          typeFileDirectories.get(normalizeDirectory(directory)) ?? [],
        );
      }

      function addTypeFile(path: string, code: string) {
        typeFiles.set(path, code);
        let current = path;
        while (current !== '/') {
          const separator = current.lastIndexOf('/');
          const parent = separator > 0 ? current.slice(0, separator) : '/';
          const name = current.slice(separator + 1);
          let entries = typeFileDirectories.get(parent);
          if (!entries) {
            entries = new Map();
            typeFileDirectories.set(parent, entries);
          }
          entries.set(name, current === path ? 1 : 2);
          current = parent;
        }
      }

      function normalizeDirectory(directory: string) {
        return directory.length > 1 && directory.endsWith('/')
          ? directory.slice(0, -1)
          : directory;
      }

      async function getPackagesWithoutTypes(source: string) {
        const packages = Array.from(
          new Set(
            ts
              .preProcessFile(source)
              .importedFiles.map(({ fileName }) => getPackageName(fileName))
              .filter((name): name is string => !!name),
          ),
        );
        const typeAvailability = await Promise.all(
          packages.map((name) => packageHasTypes(name)),
        );
        return packages.filter((_, index) => !typeAvailability[index]);
      }

      function isTypeScriptFile(fileName: string) {
        return /\.(?:d\.)?[cm]?tsx?$/.test(fileName);
      }

      function packageHasTypes(packageName: string) {
        let result = packageTypeAvailability.get(packageName);
        if (!result) {
          result = fetch(
            `${jsDelivrUriBase}/${packageName}@${
              dependencies[packageName] || 'latest'
            }/package.json`,
          )
            .then(async (response) => {
              if (!response.ok) return false;
              const packageJson = await response.json();
              return !!(
                packageJson.types ||
                packageJson.typings ||
                JSON.stringify(packageJson.exports)?.includes('"types"')
              );
            })
            .catch(() => false);
          packageTypeAvailability.set(packageName, result);
        }
        return result;
      }

      function getPackageName(moduleName: string) {
        if (
          moduleName.startsWith('.') ||
          moduleName.startsWith('/') ||
          moduleName.startsWith('@/') ||
          /^[a-z]+:/i.test(moduleName)
        ) {
          return;
        }
        const parts = moduleName.split('/');
        const packageName = moduleName.startsWith('@')
          ? parts.slice(0, 2).join('/')
          : parts[0];
        const versionMarker = packageName.startsWith('@')
          ? packageName.indexOf('@', packageName.indexOf('/') + 1)
          : packageName.indexOf('@');
        return versionMarker > 0
          ? packageName.slice(0, versionMarker)
          : packageName;
      }
    },
  );
};

type CachePolicy = 'immutable' | 'ttl';

function createTypeFileCache(onReadFile: (uri: string, text: string) => void) {
  const storageName = 'codeplayer-type-files-v1';
  const databaseStore = 'responses';
  const floatingCacheTtl = 60 * 60 * 1000;
  const networkFetch = globalThis.fetch.bind(globalThis);
  let cachePromise: Promise<Cache | undefined> | undefined;
  let databasePromise: Promise<IDBDatabase | undefined> | undefined;
  const notified = new Set<string>();

  const cacheTimestampHeader = 'x-codeplayer-cached-at';

  function getCachePolicy(uri: string): CachePolicy | undefined {
    if (isVersionedCdnUri(uri)) return 'immutable';
    if (isFloatingCdnUri(uri)) return 'ttl';
  }

  function isCacheableUri(uri: string) {
    return getCachePolicy(uri) !== undefined;
  }

  function getUri(input: RequestInfo | URL) {
    if (typeof input === 'string') return input;
    if (input instanceof URL) return input.toString();
    return input.url;
  }

  function getMethod(input: RequestInfo | URL, init?: RequestInit) {
    if (init?.method) return init.method.toUpperCase();
    if (input instanceof Request) return input.method.toUpperCase();
    return 'GET';
  }

  function getRequestCache(input: RequestInfo | URL, init?: RequestInit) {
    return init?.cache ?? (input instanceof Request ? input.cache : 'default');
  }

  function shouldCacheRequest(
    uri: string,
    input: RequestInfo | URL,
    init?: RequestInit,
  ) {
    const policy = getCachePolicy(uri);
    return (
      policy !== undefined &&
      getMethod(input, init) === 'GET' &&
      getRequestCache(input, init) !== 'no-store'
    );
  }

  function isFreshCachedResponse(response: Response, policy: CachePolicy) {
    if (policy === 'immutable') return true;
    const cachedAt = Number(response.headers.get(cacheTimestampHeader));
    return cachedAt > 0 && Date.now() - cachedAt < floatingCacheTtl;
  }

  function isFreshStoredResponse(stored: StoredResponse, policy: CachePolicy) {
    if (policy === 'immutable') return true;
    return (
      typeof stored.cachedAt === 'number' &&
      stored.cachedAt > 0 &&
      Date.now() - stored.cachedAt < floatingCacheTtl
    );
  }

  async function getCache() {
    if (typeof globalThis.caches === 'undefined') return;
    cachePromise ||= globalThis.caches.open(storageName).catch(() => undefined);
    return cachePromise;
  }

  async function getDatabase() {
    if (typeof globalThis.indexedDB === 'undefined') return;
    databasePromise ||= new Promise((resolve) => {
      try {
        const request = globalThis.indexedDB.open(storageName, 1);
        request.onupgradeneeded = () => {
          request.result.createObjectStore(databaseStore);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(undefined);
      } catch {
        resolve(undefined);
      }
    });
    return databasePromise;
  }

  async function readDatabase(uri: string) {
    const database = await getDatabase();
    if (!database) return;
    try {
      const transaction = database.transaction(databaseStore, 'readonly');
      const request = transaction.objectStore(databaseStore).get(uri);
      return await waitForRequest<StoredResponse>(request);
    } catch {
      return;
    }
  }

  async function writeDatabase(
    uri: string,
    response: Response,
    cachedAt = Date.now(),
  ) {
    const database = await getDatabase();
    if (!database || response.status < 200 || response.status > 599) return;
    try {
      const value: StoredResponse = {
        body: await response.text(),
        status: response.status,
        statusText: response.statusText,
        headers: getResponseHeaders(response),
        cachedAt,
      };
      const transaction = database.transaction(databaseStore, 'readwrite');
      transaction.objectStore(databaseStore).put(value, uri);
      await waitForTransaction(transaction);
    } catch {
      // IndexedDB is an optimization; keep the network response.
    }
  }

  async function getDatabaseKeys() {
    const database = await getDatabase();
    if (!database) return [];
    try {
      const transaction = database.transaction(databaseStore, 'readonly');
      const keys = await waitForRequest<IDBValidKey[]>(
        transaction.objectStore(databaseStore).getAllKeys(),
      );
      return keys.filter((key): key is string => typeof key === 'string');
    } catch {
      return [];
    }
  }

  function createDatabaseResponse(stored: StoredResponse) {
    const headers = new Headers(stored.headers);
    if (stored.cachedAt) {
      headers.set(cacheTimestampHeader, String(stored.cachedAt));
    }
    return new Response(stored.body, {
      status: stored.status,
      statusText: stored.statusText,
      headers,
    });
  }

  async function findCachedResponse(uri: string, policy: CachePolicy) {
    let staleResponse: Response | undefined;
    const cache = await getCache();
    if (cache) {
      try {
        const response = await cache.match(uri);
        if (response && isFreshCachedResponse(response, policy)) {
          return { response };
        }
        staleResponse = response;
      } catch {
        // Fall through to IndexedDB.
      }
    }

    const stored = await readDatabase(uri);
    if (stored) {
      const response = createDatabaseResponse(stored);
      if (isFreshStoredResponse(stored, policy)) {
        return { response };
      }
      staleResponse ||= response;
    }
    return { staleResponse };
  }

  async function createCachedResponse(response: Response, cachedAt: number) {
    const body = await response.arrayBuffer();
    const headers = new Headers(response.headers);
    headers.set(cacheTimestampHeader, String(cachedAt));
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return {
    async has(uri: string) {
      const policy = getCachePolicy(uri);
      if (!policy) return false;
      const { response } = await findCachedResponse(uri, policy);
      return !!response?.ok;
    },
    async read(uri: string) {
      const policy = getCachePolicy(uri);
      if (!policy) return;
      const { response } = await findCachedResponse(uri, policy);
      return response?.ok ? await response.text() : undefined;
    },
    async write(uri: string, text: string) {
      if (!isCacheableUri(uri)) return;
      const cache = await getCache();
      const cachedAt = Date.now();
      const response = new Response(text, {
        headers: {
          'content-type': 'text/plain',
          [cacheTimestampHeader]: String(cachedAt),
        },
      });
      await Promise.all([
        cache
          ? cache.put(uri, response.clone()).catch(() => undefined)
          : Promise.resolve(),
        writeDatabase(uri, response, cachedAt),
      ]);
    },
    async fetch(input: RequestInfo | URL, init?: RequestInit) {
      const uri = getUri(input);
      if (!shouldCacheRequest(uri, input, init)) {
        return networkFetch(input, init);
      }
      const policy = getCachePolicy(uri)!;
      const requestCache = getRequestCache(input, init);
      let staleResponse: Response | undefined;

      if (requestCache !== 'no-cache' && requestCache !== 'reload') {
        const cached = await findCachedResponse(uri, policy);
        if (cached.response) return cached.response;
        staleResponse = cached.staleResponse;
      }

      const cache = await getCache();
      let response: Response;
      try {
        response = await networkFetch(
          input,
          getNetworkInit(input, init, policy),
        );
      } catch (error) {
        if (staleResponse) return staleResponse;
        throw error;
      }
      if (shouldPersistResponse(uri, response)) {
        const cachedAt = Date.now();
        if (cache) {
          await createCachedResponse(response.clone(), cachedAt)
            .then((cachedResponse) => cache.put(uri, cachedResponse))
            .catch(() => undefined);
        }
        await writeDatabase(uri, response.clone(), cachedAt);
      }
      return response;
    },
    notify(uri: string, text: string) {
      if (notified.has(uri)) return;
      notified.add(uri);
      onReadFile(uri, text);
    },
    async readDirectory(uri: string): Promise<[string, number][]> {
      if (!isCacheableUri(uri)) return [];
      const cache = await getCache();
      try {
        const prefix = uri.endsWith('/') ? uri : `${uri}/`;
        const entries = new Map<string, number>();
        const cacheKeys = cache ? await cache.keys() : [];
        const databaseKeys = await getDatabaseKeys();
        for (const request of cacheKeys) {
          if (!request.url.startsWith(prefix)) continue;
          const relative = request.url.slice(prefix.length);
          const separator = relative.indexOf('/');
          const name = separator < 0 ? relative : relative.slice(0, separator);
          if (name) entries.set(name, separator < 0 ? 1 : 2);
        }
        for (const key of databaseKeys) {
          if (!key.startsWith(prefix)) continue;
          const relative = key.slice(prefix.length);
          const separator = relative.indexOf('/');
          const name = separator < 0 ? relative : relative.slice(0, separator);
          if (name) entries.set(name, separator < 0 ? 1 : 2);
        }
        return [...entries.entries()];
      } catch {
        return [];
      }
    },
  };
}

function shouldPersistResponse(uri: string, response: Response) {
  return (
    response.ok ||
    (isFloatingPackageApiUri(uri) &&
      (response.status === 400 || response.status === 404))
  );
}

function isFloatingPackageApiUri(uri: string) {
  try {
    const url = new URL(uri);
    return url.origin === 'https://data.jsdelivr.com' && isFloatingCdnUri(uri);
  } catch {
    return false;
  }
}

interface StoredResponse {
  body: string;
  status: number;
  statusText: string;
  headers: [string, string][];
  cachedAt?: number;
}

function waitForRequest<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getResponseHeaders(response: Response): [string, string][] {
  const headers: [string, string][] = [];
  response.headers.forEach((value, key) => headers.push([key, value]));
  return headers;
}

function getNetworkInit(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  policy: CachePolicy,
) {
  if (init?.cache || (input instanceof Request && input.cache !== 'default')) {
    return init;
  }
  return {
    ...init,
    cache: policy === 'ttl' ? 'no-cache' : ('force-cache' as RequestCache),
  };
}

function waitForTransaction(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function isVersionedCdnUri(uri: string) {
  try {
    const url = new URL(uri);
    const jsDelivrBase = new URL(jsDelivrUriBase);
    if (
      url.origin === jsDelivrBase.origin &&
      url.pathname.startsWith(`${jsDelivrBase.pathname}/`)
    ) {
      return hasExactPackageVersion(
        url.pathname.slice(jsDelivrBase.pathname.length + 1),
      );
    }

    if (url.origin === 'https://data.jsdelivr.com') {
      for (const prefix of ['/v1/package/resolve/npm/', '/v1/package/npm/']) {
        if (url.pathname.startsWith(prefix)) {
          return hasExactPackageVersion(url.pathname.slice(prefix.length));
        }
      }
    }
  } catch {
    return false;
  }
  return false;
}

function isFloatingCdnUri(uri: string) {
  try {
    const url = new URL(uri);
    const jsDelivrBase = new URL(jsDelivrUriBase);
    if (
      url.origin === jsDelivrBase.origin &&
      url.pathname.startsWith(`${jsDelivrBase.pathname}/`)
    ) {
      return !hasExactPackageVersion(
        url.pathname.slice(jsDelivrBase.pathname.length + 1),
      );
    }

    if (url.origin === 'https://data.jsdelivr.com') {
      for (const prefix of ['/v1/package/resolve/npm/', '/v1/package/npm/']) {
        if (url.pathname.startsWith(prefix)) {
          return !hasExactPackageVersion(url.pathname.slice(prefix.length));
        }
      }
    }
  } catch {
    return false;
  }
  return false;
}

function hasExactPackageVersion(path: string) {
  const segments = decodeURIComponent(path).split('/').filter(Boolean);
  const packageSegment = segments[0]?.startsWith('@')
    ? segments[1]
    : segments[0];
  if (!packageSegment) return false;
  const marker = packageSegment.lastIndexOf('@');
  return marker > 0 && isExactVersion(packageSegment.slice(marker + 1));
}

function isExactVersion(value: string) {
  return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(value);
}

async function importTsFromCdn(tsVersion: string) {
  const _module = globalThis.module;
  (globalThis as any).module = { exports: {} };
  const tsUrl = `https://cdn.jsdelivr.net/npm/typescript@${tsVersion}/lib/typescript.js`;
  await import(/* @vite-ignore */ tsUrl);
  const ts = globalThis.module.exports;
  globalThis.module = _module;
  return ts as typeof import('typescript');
}

async function fetchJson<T>(url: string) {
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      return await res.json();
    }
  } catch {
    // ignore
  }
}
