import { MapFile } from '@/constant';
import type { File } from '@/compiler';

const versionCacheName = 'codeplayer-package-versions-v1';
const versionCacheTtl = 60 * 60 * 1000;
const versionStoragePrefix = 'codeplayer-package-version-v1:';
const exactVersionPattern =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const resolvedVersions = new Map<string, string>();
const resolvingVersions = new Map<string, Promise<string | undefined>>();
let versionCachePromise: Promise<Cache | undefined> | undefined;

type NegativeVersionStatus = 400 | 404;
type VersionCacheEntry = {
  version?: string;
  status?: NegativeVersionStatus;
  cachedAt: number;
};

export const vueDependencyNames = [
  'vue',
  '@vue/compiler-core',
  '@vue/compiler-dom',
  '@vue/compiler-sfc',
  '@vue/compiler-ssr',
  '@vue/reactivity',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/shared',
] as const;

export function getImportedPackages(
  files: Record<string, File>,
  includeImportMap = true
) {
  const packages = new Set<string>();
  const importPattern =
    /\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]|\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const file of Object.values(files)) {
    for (const match of file.code.matchAll(importPattern)) {
      const packageName = normalizePackageName(match[1] || match[2] || '');
      if (packageName) packages.add(packageName);
    }
  }

  if (includeImportMap) {
    for (const packageName of Object.keys(getImportMapDependencies(files))) {
      packages.add(packageName);
    }
  }
  return packages;
}

export function getImportMapDependencies(
  files: Record<string, File>
): Record<string, string> {
  const importMap = files[MapFile]?.code;
  if (!importMap) return {};

  try {
    const dependencies: Record<string, string> = {};
    const parsedImportMap = JSON.parse(importMap);
    collectImportMapDependencies(parsedImportMap.imports, dependencies);
    for (const scopes of Object.values(parsedImportMap.scopes || {})) {
      collectImportMapDependencies(scopes, dependencies);
    }
    return dependencies;
  } catch {
    return {};
  }
}

export async function resolveDependencyVersions(
  dependencies: Record<string, string>
): Promise<Record<string, string>> {
  const normalizedDependencies = new Map<string, string>();
  for (const [packageName, reference] of Object.entries(dependencies)) {
    const normalizedPackageName = normalizePackageName(packageName);
    if (normalizedPackageName) {
      normalizedDependencies.set(normalizedPackageName, reference);
    }
  }

  const entries = await Promise.all(
    [...normalizedDependencies].map(async ([packageName, reference]) => [
      packageName,
      await resolveDependencyVersion(packageName, reference),
    ] as const)
  );
  return Object.fromEntries(entries);
}

export async function resolveImportMap(
  files: Record<string, File>
): Promise<string> {
  const source = files[MapFile]?.code || '';
  if (!source) return source;

  let importMap: any;
  try {
    importMap = JSON.parse(source);
  } catch {
    return source;
  }

  const dependencies = await resolveDependencyVersions(
    getImportMapDependencies(files)
  );
  if (dependencies.vue) {
    for (const packageName of vueDependencyNames) {
      dependencies[packageName] = dependencies.vue;
    }
  }
  rewriteImportMap(importMap, dependencies);
  return JSON.stringify(importMap, null, 2);
}

function collectImportMapDependencies(
  mappings: unknown,
  dependencies: Record<string, string>
) {
  if (!mappings || typeof mappings !== 'object') return;

  for (const [specifier, target] of Object.entries(mappings)) {
    if (typeof target !== 'string') continue;
    const packageName = normalizePackageName(specifier);
    if (!packageName) continue;

    dependencies[packageName] = normalizeDependencyReference(
      getVersionFromUrl(target, packageName) || 'latest'
    );
    const targetDependencies = getQueryDependencies(target);
    for (const [dependencyName, reference] of targetDependencies) {
      if (!(dependencyName in dependencies)) {
        dependencies[dependencyName] = normalizeDependencyReference(reference);
      }
    }
  }
}

async function resolveDependencyVersion(
  packageName: string,
  reference: string
) {
  const normalizedReference = normalizeDependencyReference(reference);
  if (isExactVersion(normalizedReference)) return normalizedReference;

  const key = `${packageName}@${normalizedReference}`;
  const resolved = resolvedVersions.get(key);
  if (resolved) return resolved;

  let request = resolvingVersions.get(key);
  if (!request) {
    request = fetchResolvedVersion(packageName, normalizedReference);
    resolvingVersions.set(key, request);
  }

  let version: string | undefined;
  try {
    version = await request;
  } catch {
    // Keep the normalized reference when version resolution fails.
  } finally {
    resolvingVersions.delete(key);
  }
  const sessionVersion = version || normalizedReference;
  if (version) {
    resolvedVersions.set(key, version);
  }
  return sessionVersion;
}

async function fetchResolvedVersion(packageName: string, reference: string) {
  const url =
    `https://data.jsdelivr.com/v1/package/resolve/npm/` +
    `${encodeURIComponent(packageName)}@${encodeURIComponent(reference)}`;
  const cache = await getVersionCache();
  let staleVersion: string | undefined;
  const storedEntry = readStoredVersion(url);

  if (storedEntry) {
    if (Date.now() - storedEntry.cachedAt < versionCacheTtl) {
      return storedEntry.version;
    }
    staleVersion = storedEntry.version;
  }

  if (cache) {
    try {
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        const cachedEntry = await readCachedVersion(cachedResponse);
        if (cachedEntry) {
          const cachedAt = Number(
            cachedResponse.headers.get('x-codeplayer-cached-at')
          );
          if (cachedAt && Date.now() - cachedAt < versionCacheTtl) {
            return cachedEntry.version;
          }
          staleVersion ||= cachedEntry.version;
        }
      }
    } catch {
      // Cache Storage is an optimization; use the network when it fails.
    }
  }

  try {
    const response = await fetch(url, {
      cache: storedEntry || staleVersion ? 'reload' : 'default',
    });
    if (isNegativeVersionStatus(response.status)) {
      await writeVersionCache(url, { status: response.status }, cache);
      return staleVersion;
    }
    if (!response.ok) return staleVersion;
    const payload = await response.json();
    const version =
      typeof payload?.version === 'string' && isExactVersion(payload.version)
        ? payload.version
        : undefined;
    if (!version) return staleVersion;

    await writeVersionCache(url, { version }, cache);
    return version;
  } catch {
    return staleVersion;
  }
}

function readStoredVersion(url: string): VersionCacheEntry | undefined {
  try {
    const value = globalThis.localStorage.getItem(
      `${versionStoragePrefix}${url}`
    );
    if (!value) return;
    const stored = JSON.parse(value);
    const hasVersion =
      typeof stored?.version === 'string' && isExactVersion(stored.version);
    const hasNegativeStatus = isNegativeVersionStatus(stored?.status);
    if (
      (!hasVersion && !hasNegativeStatus) ||
      typeof stored.cachedAt !== 'number'
    ) {
      return;
    }
    return {
      version: hasVersion ? stored.version : undefined,
      status: hasNegativeStatus ? stored.status : undefined,
      cachedAt: stored.cachedAt,
    };
  } catch {
    return;
  }
}

function writeStoredVersion(
  url: string,
  entry: Omit<VersionCacheEntry, 'cachedAt'>,
  cachedAt: number
) {
  try {
    globalThis.localStorage.setItem(
      `${versionStoragePrefix}${url}`,
      JSON.stringify({ ...entry, cachedAt })
    );
  } catch {
    // Local storage is an optimization; keep the resolved version in memory.
  }
}

async function getVersionCache() {
  if (typeof globalThis.caches === 'undefined') return;
  versionCachePromise ||= globalThis.caches
    .open(versionCacheName)
    .catch(() => undefined);
  return versionCachePromise;
}

async function writeVersionCache(
  url: string,
  entry: Omit<VersionCacheEntry, 'cachedAt'>,
  cache: Cache | undefined
) {
  const cachedAt = Date.now();
  if (cache) {
    try {
      await cache.put(
        url,
        new Response(JSON.stringify(entry), {
          headers: {
            'content-type': 'application/json',
            'x-codeplayer-cached-at': String(cachedAt),
          },
        })
      );
    } catch {
      // Cache Storage is an optimization; keep the resolved version.
    }
  }
  writeStoredVersion(url, entry, cachedAt);
}

async function readCachedVersion(
  response: Response
): Promise<Omit<VersionCacheEntry, 'cachedAt'> | undefined> {
  try {
    const payload = await response.json();
    if (
      typeof payload?.version === 'string' &&
      isExactVersion(payload.version)
    ) {
      return { version: payload.version };
    }
    if (isNegativeVersionStatus(payload?.status)) {
      return { status: payload.status };
    }
  } catch {
    // Ignore malformed cache entries.
  }
}

function isNegativeVersionStatus(value: unknown): value is NegativeVersionStatus {
  return value === 400 || value === 404;
}

function rewriteImportMap(
  importMap: any,
  dependencies: Record<string, string>
) {
  rewriteMappings(importMap.imports, dependencies);
  if (importMap.scopes && typeof importMap.scopes === 'object') {
    for (const mappings of Object.values(importMap.scopes)) {
      rewriteMappings(mappings, dependencies);
    }
  }
}

function rewriteMappings(
  mappings: unknown,
  dependencies: Record<string, string>
) {
  if (!mappings || typeof mappings !== 'object') return;

  for (const [specifier, target] of Object.entries(mappings)) {
    if (typeof target !== 'string') continue;
    const packageName = normalizePackageName(specifier);
    if (!packageName) continue;
    const version = dependencies[packageName];
    if (!version) continue;
    (mappings as Record<string, unknown>)[specifier] = rewriteTarget(
      target,
      packageName,
      version,
      dependencies
    );
  }
}

function rewriteTarget(
  target: string,
  packageName: string,
  version: string,
  dependencies: Record<string, string>
) {
  try {
    const url = new URL(target);
    const packagePath = findPackagePath(url, packageName);
    if (packagePath) {
      const currentVersion = packagePath.version;
      const segments = url.pathname.split('/');
      const segment = decodeURIComponent(segments[packagePath.versionIndex]);
      const hasMalformedVersion = hasMalformedPackageVersion(
        segment,
        packageName
      );
      if (
        (isExactVersion(version) || hasMalformedVersion) &&
        (!currentVersion ||
          !isExactVersion(currentVersion) ||
          hasMalformedVersion)
      ) {
        const packageSegment = getPackageSegment(segment, packageName);
        const replacementVersion = isExactVersion(version) ? version : 'latest';
        segments[
          packagePath.versionIndex
        ] = `${packageSegment}@${replacementVersion}`;
        url.pathname = segments.join('/');
      }
    }

    const queryDependencies = url.searchParams.get('deps');
    if (queryDependencies) {
      url.searchParams.set(
        'deps',
        rewriteDependencyList(queryDependencies, dependencies)
      );
    }
    return url.toString();
  } catch {
    return target;
  }
}

function getPackageSegment(segment: string, packageName: string) {
  if (packageName.startsWith('@') && segment.startsWith(packageName)) {
    return packageName;
  }
  const marker = segment.indexOf('@');
  return marker > 0 ? segment.slice(0, marker) : segment;
}

function hasMalformedPackageVersion(segment: string, packageName: string) {
  const packageSegment = getPackageSegment(segment, packageName);
  if (!segment.startsWith(packageSegment)) return false;
  const version = segment.slice(packageSegment.length);
  return version.startsWith('@') && version.indexOf('@', 1) >= 0;
}

function findPackagePath(url: URL, packageName: string) {
  const segments = url.pathname.split('/');
  const packageParts = packageName.split('/');

  for (let index = 0; index < segments.length; index++) {
    const segment = decodeURIComponent(segments[index]);
    if (packageParts.length === 1) {
      const marker = segment.lastIndexOf('@');
      const name = marker > 0 ? segment.slice(0, marker) : segment;
      if (name === packageName) {
        return {
          version: marker > 0 ? segment.slice(marker + 1) : undefined,
          versionIndex: index,
        };
      }
      continue;
    }

    const encodedPackageName = packageParts.join('/');
    if (
      segment === encodedPackageName ||
      segment.startsWith(`${encodedPackageName}@`)
    ) {
      const marker = segment.lastIndexOf('@');
      return {
        version: marker > 0 ? segment.slice(marker + 1) : undefined,
        versionIndex: index,
      };
    }

    const nextSegment = segments[index + 1];
    if (segment !== packageParts[0] || nextSegment === undefined) continue;
    const decodedNextSegment = decodeURIComponent(nextSegment);
    const marker = decodedNextSegment.lastIndexOf('@');
    const name =
      marker > 0 ? decodedNextSegment.slice(0, marker) : decodedNextSegment;
    if (name === packageParts[1]) {
      return {
        version: marker > 0 ? decodedNextSegment.slice(marker + 1) : undefined,
        versionIndex: index + 1,
      };
    }
  }
}

function rewriteDependencyList(
  value: string,
  dependencies: Record<string, string>
) {
  return value
    .split(',')
    .map((item) => {
      const parsed = parseDependencyReference(item);
      if (!parsed || !dependencies[parsed.packageName]) return item;
      return `${parsed.packageName}@${dependencies[parsed.packageName]}`;
    })
    .join(',');
}

function getQueryDependencies(target: string) {
  try {
    const value = new URL(target).searchParams.get('deps');
    if (!value) return [];
    return value
      .split(',')
      .map(parseDependencyReference)
      .filter((item): item is { packageName: string; reference: string } =>
        !!item
      )
      .map(({ packageName, reference }) => [packageName, reference] as const);
  } catch {
    return [];
  }
}

function parseDependencyReference(value: string) {
  const item = value.trim();
  if (!item) return;

  const marker = item.startsWith('@')
    ? item.indexOf('@', item.indexOf('/') + 1)
    : item.indexOf('@');
  if (marker <= 0) {
    return { packageName: item, reference: 'latest' };
  }
  return {
    packageName: item.slice(0, marker),
    reference: item.slice(marker + 1) || 'latest',
  };
}

function normalizePackageName(specifier: string) {
  const normalizedSpecifier = specifier.endsWith('/')
    ? specifier.slice(0, -1)
    : specifier;
  const parsed = parseDependencyReference(normalizedSpecifier);
  const packageName = parsed?.packageName || normalizedSpecifier;
  if (
    !packageName ||
    packageName.startsWith('.') ||
    packageName.startsWith('/') ||
    packageName.startsWith('@/') ||
    packageName.includes(':')
  ) {
    return;
  }
  return packageName.startsWith('@')
    ? packageName.split('/').slice(0, 2).join('/')
    : packageName.split('/')[0];
}

function normalizeDependencyReference(reference: string) {
  const normalized = reference.trim();
  return normalized && !normalized.includes('@') ? normalized : 'latest';
}

function getVersionFromUrl(target: string, packageName?: string) {
  try {
    const url = new URL(target);
    if (packageName) {
      const packagePath = findPackagePath(url, packageName);
      if (packagePath) {
        return normalizeDependencyReference(packagePath.version || 'latest');
      }
    }
    const segments = url.pathname.split('/').filter(Boolean);
    if (!segments.length) return;
    const packageIndex = segments[0] === 'npm' ? 1 : 0;
    const firstSegment = segments[packageIndex];
    const packageSegment = firstSegment?.startsWith('@')
      ? segments[packageIndex + 1]
      : firstSegment;
    if (!packageSegment) return 'latest';
    const marker = packageSegment.lastIndexOf('@');
    return normalizeDependencyReference(
      marker > 0 ? packageSegment.slice(marker + 1) : 'latest'
    );
  } catch {
    return 'latest';
  }
}

function isExactVersion(value: string) {
  return exactVersionPattern.test(value);
}
