import { createHooks, Hookable } from 'hookable';
import { builtInPlugins } from './transform/plugins';
import { File } from './type';
import { Plugin, ComplierPluginParams, ComplierPluginResult } from './type';

export * from './file-system';
export * from './module';
export * from './type';

interface CompilerOptions {
  plugins?: Array<Plugin>;
  vueVersion?: 2 | 3;
}

export class Compiler {
  hooks: Hookable<Record<string, any>, string>;
  vueVersion: 2 | 3;

  constructor(options?: CompilerOptions) {
    this.hooks = createHooks();
    this.vueVersion = options?.vueVersion || 3;
    this.init(options?.plugins || []);
  }

  async init(_plugins: Array<Plugin>) {
    [...builtInPlugins(this.vueVersion), ..._plugins].forEach((plugin) => {
      plugin(this.hooks);
    });
    await this.hooks.callHook('after-init');
  }

  async run(params: ComplierPluginParams) {
    // before-transform
    await this.hooks.callHook('before-transform', params);
    // transform
    await this.hooks.callHook('transform', params);
    // before-compile
    await this.hooks.callHook('before-compile', params);
    // compile-module
    const compiledResult = (await this.hooks.callHook(
      'compile-module',
      params
    )) as ComplierPluginResult;
    // before-emit
    await this.hooks.callHook('before-emit', params, compiledResult);
    // emit
    await this.hooks.callHook('emit', params, compiledResult);
    // after-emit
    await this.hooks.callHook('after-emit', params, compiledResult);
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
