export const COMP_IDENTIFIER = `__sfc__`;
export const modulesKey = `__modules__`;
export const exportKey = `__export__`;
export const dynamicImportKey = `__dynamic_import__`;
export const moduleKey = `__module__`;
export const nextKey = '__next__';
export const scriptRE = /<script\b(?:\s[^>]*>|>)([^]*?)<\/script>/gi;
export const scriptModuleRE =
  /<script\b[^>]*type\s*=\s*(?:"module"|'module')[^>]*>([^]*?)<\/script>/gi;
export const MapFile = 'import-map.json';
export const version = '3.2.45';
export const defaultMainFile = 'App.vue';
export const fileTypes = ['.html', '.js', '.css', '.vue', '.ts', 'jsx', 'tsx'];
export * from './tooltip';
