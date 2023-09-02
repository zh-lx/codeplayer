import { createHooks, Hookable } from 'hookable';
import { plugins } from './transform/plugins';
import { File } from './file-system';
import { MapFile } from '@/constant';
import { Plugin } from './type';

export * from './file-system';
export * from './module';

export class Compiler {
  hooks: Hookable<Record<string, any>, string>;

  constructor(options?: { plugins: Array<Plugin> }) {
    this.hooks = createHooks();
    this.init(options?.plugins || []);
  }

  async init(_plugins: Array<Plugin>) {
    [...plugins, ..._plugins].forEach((plugin) => {
      plugin(this.hooks);
    });
    await this.hooks.callHook('after-init');
  }

  async run(params: {
    fileMap: Record<string, File>;
    result: { errors: Error[] };
    entry: string;
    iframe: HTMLIFrameElement;
    render: boolean;
  }) {
    const { fileMap, result, entry, iframe, render } = params;
    const files = Object.keys(fileMap).map((filename) => fileMap[filename]);
    // before-transform
    await this.hooks.callHook('before-transform', params);
    // transform
    await this.transform(files, result);
    // before-compile
    await this.hooks.callHook('before-compile', params);
    // compile-module
    const { processed: modules, styles, links } = await this.hooks.callHook(
      'compile-module',
      fileMap,
      entry
    );
    // before-emit
    await this.hooks.callHook('before-emit', params);
    // emit
    await this.hooks.callHook('emit', {
      modules,
      styles,
      importMap: fileMap[MapFile].code,
      iframe,
      render,
      links,
    });
    // after-emit
    await this.hooks.callHook('after-emit', params);
  }

  // 文件转换
  async transform(files: File[], result: { errors: Error[] }) {
    const transformTasks = files.map(
      (file) =>
        new Promise(async (resolve) => {
          const errors = await this.hooks.callHook('transform', file);
          if (errors) {
            result.errors.push(...errors);
          }
          resolve(true);
        })
    );
    await Promise.all(transformTasks);
  }
}
