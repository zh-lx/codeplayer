import transformTsPlugin from './transform-ts';
import transformVue3Plugin from './transform-vue3';
import transformVue2Plugin from './transform-vue2';
import transformReactPlugin from './transform-react';
import transformCssPlugin from './transform-css';
import transformScssPlugin from './transform-scss';
import transformLessPlugin from './transform-less';
import compileModulePlugin from '@/compiler/plugins/module-factory';
import emitHtmlPlugin from '@/compiler/plugins/emit-html';

export const builtInPlugins = (vueVersion = 3) => [
  transformTsPlugin,
  vueVersion.toString() === '2' ? transformVue2Plugin : transformVue3Plugin,
  transformReactPlugin,
  transformCssPlugin,
  transformScssPlugin,
  transformLessPlugin,
  compileModulePlugin,
  emitHtmlPlugin,
];
