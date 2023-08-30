import transformTsPlugin from './transform-ts';
import transformVue3Plugin from './transform-vue3';
import transformReactPlugin from './transform-react';
import transformCssPlugin from './transform-css';
import transformScssPlugin from './transform-scss';
import transformLessPlugin from './transform-less';
import compileModulePlugin from '@/compiler/plugins/module-factory'
import emitHtmlPlugin from '@/compiler/plugins/emit-html'

export const plugins = [
  transformTsPlugin, 
  transformVue3Plugin, 
  transformReactPlugin, 
  transformCssPlugin, 
  transformScssPlugin, 
  transformLessPlugin,
  compileModulePlugin,
  emitHtmlPlugin
];