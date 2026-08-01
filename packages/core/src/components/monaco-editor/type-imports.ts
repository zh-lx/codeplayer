import { MapFile } from '@/constant';
import type { File } from '@/compiler';

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
    const imports = JSON.parse(importMap).imports;
    if (!imports || typeof imports !== 'object') return {};

    const dependencies: Record<string, string> = {};
    for (const [specifier, target] of Object.entries(imports)) {
      if (typeof target !== 'string') continue;
      const packageName = normalizePackageName(specifier);
      if (!packageName) continue;
      dependencies[packageName] = getVersionFromUrl(target) || 'latest';
    }
    return dependencies;
  } catch {
    return {};
  }
}

function normalizePackageName(specifier: string) {
  const packageName = specifier.endsWith('/')
    ? specifier.slice(0, -1)
    : specifier;
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

function getVersionFromUrl(target: string) {
  try {
    const url = new URL(target);
    const segments = url.pathname.split('/').filter(Boolean);
    if (!segments.length) return;
    const packageSegment = segments[0].startsWith('@')
      ? segments[1]
      : segments[0];
    if (!packageSegment) return;
    const marker = packageSegment.lastIndexOf('@');
    return marker > 0 ? packageSegment.slice(marker + 1) : 'latest';
  } catch {
    return 'latest';
  }
}
