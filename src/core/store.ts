import { version } from '../constant';
import {
  SFCScriptCompileOptions,
  SFCAsyncStyleCompileOptions,
  SFCTemplateCompileOptions,
} from '@vue/compiler-sfc';
import * as defaultCompiler from '@vue/compiler-sfc';
import { File } from './file';
import { utoa, atou } from '../utils';
import { compileFile } from '../transform';
import { MapFile } from '../constant';

const defaultMainFile = 'App.vue';

const welcomeCode = `
<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>
`.trim();

type OutputModes = 'preview' | 'js' | 'css' | 'ssr';

export interface StoreState {
  // entry file
  mainFile: string;
  // all files
  files: Record<string, File>;
  // current file
  activeFile: File;
  errors: (string | Error)[];
  vueRuntimeURL: string;
  // vueServerRendererURL: string;
  // used to force reset the sandbox
  resetFlip: boolean;
}

export interface SFCOptions {
  script?: Omit<SFCScriptCompileOptions, 'id'>;
  style?: SFCAsyncStyleCompileOptions;
  template?: SFCTemplateCompileOptions;
}

export interface Store {
  state: StoreState;
  vue3SFCOptions?: SFCOptions;
  compiler: typeof defaultCompiler;
  vueVersion?: string;
  init: () => void;
  setActive: (filename: string) => void;
  addFile: (filename: string | File) => void;
  deleteFile: (filename: string) => void;
  getImportMap: () => any;
  initialShowOutput: boolean;
  initialOutputMode: OutputModes;
}

export interface StoreOptions {
  serializedState?: string;
  showOutput?: boolean;
  // loose type to allow getting from the URL without inducing a typing error
  outputMode?: OutputModes | string;
  defaultVueRuntimeURL?: string;
  initFiles?: Record<string, string>;
  // defaultVueServerRendererURL?: string
}

export class ReplStore implements Store {
  state: StoreState;
  compiler = defaultCompiler;
  vueVersion?: string;
  vue3SFCOptions?: SFCOptions;
  initialShowOutput: boolean;
  initialOutputMode: OutputModes;

  private defaultVueRuntimeURL: string;
  // private defaultVueServerRendererURL: string;
  private pendingCompiler: Promise<any> | null = null;

  constructor({
    serializedState = '',
    defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`,
    // defaultVueServerRendererURL = `https://unpkg.com/@vue/server-renderer@${version}/dist/server-renderer.esm-browser.js`,
    showOutput = false,
    outputMode = 'preview',
    initFiles = {},
  }: StoreOptions = {}) {
    let files: StoreState['files'] = {};

    if (initFiles) {
      for (const filename in initFiles) {
        files[filename] = new File(filename, initFiles[filename]);
      }
    } else if (serializedState) {
      // 将 { filename: code } 格式的压缩后字符串转换为 utf8 JSON字符串
      const saved = JSON.parse(atou(serializedState));
      for (const filename in saved) {
        files[filename] = new File(filename, saved[filename]);
      }
    } else {
      files = {
        [defaultMainFile]: new File(defaultMainFile, welcomeCode),
      };
    }

    this.defaultVueRuntimeURL = defaultVueRuntimeURL;
    // this.defaultVueServerRendererURL = defaultVueServerRendererURL;
    this.initialShowOutput = showOutput;
    this.initialOutputMode = outputMode as OutputModes;

    let mainFile = defaultMainFile;
    if (!files[mainFile]) {
      mainFile = Object.keys(files)[0];
    }

    // init state
    this.state = {
      mainFile,
      files,
      activeFile: files[mainFile],
      errors: [],
      vueRuntimeURL: this.defaultVueRuntimeURL,
      // vueServerRendererURL: this.defaultVueServerRendererURL,
      resetFlip: true,
    };

    this.initImportMap();
  }

  // don't start compiling until the vue3SFCOptions are set
  async init() {
    const compileFilePromises = Promise.all(
      Object.keys(this.state.files).map((file) =>
        compileFile(this, this.state.files[file])
      )
    );
    await compileFilePromises;
  }

  setActive(filename: string) {
    this.state.activeFile = this.state.files[filename];
  }

  addFile(fileOrFilename: string | File): void {
    const file =
      typeof fileOrFilename === 'string'
        ? new File(fileOrFilename)
        : fileOrFilename;
    this.state.files[file.filename] = file;
    if (!file.hidden) this.setActive(file.filename);
  }

  deleteFile(filename: string) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFile.filename === filename) {
        this.state.activeFile = this.state.files[this.state.mainFile];
      }
      delete this.state.files[filename];
    }
  }

  serialize() {
    return '#' + utoa(JSON.stringify(this.getFiles()));
  }

  getFiles() {
    const exported: Record<string, string> = {};
    for (const filename in this.state.files) {
      exported[filename] = this.state.files[filename].code;
    }
    return exported;
  }

  async setFiles(newFiles: Record<string, string>, mainFile = defaultMainFile) {
    const files: Record<string, File> = {};
    if (mainFile === defaultMainFile && !newFiles[mainFile]) {
      files[mainFile] = new File(mainFile, welcomeCode);
    }
    for (const filename in newFiles) {
      files[filename] = new File(filename, newFiles[filename]);
    }
    for (const file in files) {
      await compileFile(this, files[file]);
    }
    this.state.mainFile = mainFile;
    this.state.files = files;
    this.initImportMap();
    this.setActive(mainFile);
    this.forceSandboxReset();
  }

  private forceSandboxReset() {
    this.state.resetFlip = !this.state.resetFlip;
  }

  private initImportMap() {
    const map = this.state.files[MapFile];
    if (!map) {
      this.state.files[MapFile] = new File(
        MapFile,
        JSON.stringify(
          {
            imports: {
              vue: this.defaultVueRuntimeURL,
            },
          },
          null,
          2
        )
      );
    } else {
      try {
        const json = JSON.parse(map.code);
        if (!json.imports.vue) {
          json.imports.vue = this.defaultVueRuntimeURL;
          map.code = JSON.stringify(json, null, 2);
        }
        // if (!json.imports['vue/server-renderer']) {
        //   json.imports['vue/server-renderer'] =
        //     this.defaultVueServerRendererURL;
        //   map.code = JSON.stringify(json, null, 2);
        // }
      } catch (e) {}
    }
  }

  getImportMap() {
    try {
      return JSON.parse(this.state.files[MapFile].code);
    } catch (e) {
      this.state.errors = [
        `Syntax error in ${MapFile}: ${(e as Error).message}`,
      ];
      return {};
    }
  }

  setImportMap(map: {
    imports: Record<string, string>;
    scopes?: Record<string, Record<string, string>>;
  }) {
    this.state.files[MapFile]!.code = JSON.stringify(map, null, 2);
  }

  async setVueVersion(version: string) {
    this.vueVersion = version;
    const compilerUrl = `https://unpkg.com/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`;
    const runtimeUrl = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`;
    // const ssrUrl = `https://unpkg.com/@vue/server-renderer@${version}/dist/server-renderer.esm-browser.js`;
    this.pendingCompiler = import(/* @vite-ignore */ compilerUrl);
    this.compiler = await this.pendingCompiler;
    this.pendingCompiler = null;
    this.state.vueRuntimeURL = runtimeUrl;
    // this.state.vueServerRendererURL = ssrUrl;
    const importMap = this.getImportMap();
    const imports = importMap.imports || (importMap.imports = {});
    imports.vue = runtimeUrl;
    // imports['vue/server-renderer'] = ssrUrl;
    this.setImportMap(importMap);
    this.forceSandboxReset();
    console.info(`[@vue/repl] Now using Vue version: ${version}`);
  }

  resetVueVersion() {
    this.vueVersion = undefined;
    this.compiler = defaultCompiler;
    this.state.vueRuntimeURL = this.defaultVueRuntimeURL;
    // this.state.vueServerRendererURL = this.defaultVueServerRendererURL;
    const importMap = this.getImportMap();
    const imports = importMap.imports || (importMap.imports = {});
    imports.vue = this.defaultVueRuntimeURL;
    // imports['vue/server-renderer'] = this.defaultVueServerRendererURL;
    this.setImportMap(importMap);
    this.forceSandboxReset();
    console.info(`[@vue/repl] Now using default Vue version`);
  }
}
