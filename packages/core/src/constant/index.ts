export const COMP_IDENTIFIER = `__sfc__`;
export const modulesKey = `__modules__`;
export const exportKey = `__export__`;
export const dynamicImportKey = `__dynamic_import__`;
export const moduleKey = `__module__`;
export const nextKey = '__next__';
export const scriptRE = /<script\b(?:\s[^>]*>|>)([^]*?)<\/script>/gi;
export const styleRE = /<style\b(?:\s[^>]*>|>)([^]*?)<\/style>/gi;
export const scriptModuleRE =
  /<script\b[^>]*type\s*=\s*(?:"module"|'module')[^>]*>([^]*?)<\/script>/gi;
export const MapFile = 'import-map.json';
export const version = '3.2.45';
export const defaultentry = 'index.html';
export const fileTypes = [
  '.html',
  '.js',
  '.css',
  '.vue',
  '.ts',
  'jsx',
  'tsx',
  'json',
  '.less',
  '.scss',
  '.sass',
];
export const extensions = ['.js', '.ts', '.json', '.jsx', '.tsx', '.vue'];
export const URLCodeKey = '_codeplayer_code';
export * from './tooltip';

export const CodeSizes = [12, 13, 14, 15, 16, 17, 18];
export const LocalThemeKey = 'codeplayer_local_theme_key';
