<script setup lang="ts">
import { ref, Ref, onMounted, watch } from 'vue';
import { fileStore, store } from '@/store';
import { compileModulesForPreview } from '@/utils';
import {
  modulesKey,
  exportKey,
  dynamicImportKey,
  nextKey,
  MapFile,
} from '@/constant';
import { compileFile } from '@/transform';
import { renderIframeString } from './dom-string';

interface IframeWindow extends Window {
  process: Record<string, any>;
  [modulesKey]: Record<string, any>;
  [exportKey]: Function;
  [dynamicImportKey]: Function;
  __next__: Function;
}

const errors = ref<string[]>([]);
const previewDOM = ref() as Ref<HTMLDivElement>;

onMounted(() => {
  renderSandbox();
});

const refreshPreview = () => {
  if (previewDOM.value) {
    renderSandbox();
  }
};

watch(() => fileStore.files, refreshPreview, {
  deep: true,
});

watch(() => fileStore.mainFile, refreshPreview);

watch(() => store.refreshID, refreshPreview);

const compileFiles = async () => {
  const result = { errors: [] };
  const compileFilePromises = Promise.all(
    Object.keys(fileStore.files).map((file) =>
      compileFile(result, fileStore.files[file])
    )
  );
  await compileFilePromises;
  errors.value = result.errors;
};

const getImportMap = () => {
  try {
    return JSON.parse(fileStore.files[MapFile].code);
  } catch (e) {
    errors.value = [`Syntax error in ${MapFile}: ${(e as Error).message}`];
    return {};
  }
};

const renderSandbox = async () => {
  await compileFiles();
  const modules = compileModulesForPreview(fileStore.files, fileStore.mainFile);
  // 建立一个新的 iframe
  previewDOM.value.querySelector('iframe')?.remove();
  const iframe = document.createElement('iframe');
  iframe.className = 'code-sandbox-iframe';
  previewDOM.value.append(iframe);

  const iframeDoc = iframe.contentDocument as Document;
  const iframeWindow = iframe.contentWindow as IframeWindow;
  iframeWindow.process = { env: {} };
  iframeWindow[modulesKey] = {};
  iframeWindow[exportKey] = (mod: Object, key: string, get: () => any) => {
    Object.defineProperty(mod, key, {
      enumerable: true,
      configurable: true,
      get,
    });
  };
  iframeWindow[dynamicImportKey] = (key: string) => {
    return Promise.resolve(iframeWindow[modulesKey][key]);
  };

  iframeDoc.open();
  iframeDoc.write(renderIframeString(`${JSON.stringify(getImportMap())}`));

  const codeToEval = [
    `window.__modules__ = {}\nwindow.__css__ = ''\n` +
      `if (window.__app__) window.__app__.unmount()\n` +
      `document.body.innerHTML = '<div id="app"></div>'`,
    ...modules,
    `document.getElementById('__sfc-styles').innerHTML = window.__css__`,
  ];

  // if main file is a vue file, mount it.
  if (fileStore.mainFile.endsWith('.vue')) {
    codeToEval.push(
      `import { createApp as _createApp } from "vue"
        const _mount = () => {
            const AppComponent = __modules__["${fileStore.mainFile}"].default
            AppComponent.name = 'Repl'
            const app = window.__app__ = _createApp(AppComponent)
            app.config.unwrapInjectedRef = true
            app.config.errorHandler = e => console.error(e)
            app.mount('#app')
          };
        _mount();`
    );
  }

  if (
    fileStore.mainFile.endsWith('.jsx') ||
    fileStore.mainFile.endsWith('.tsx')
  ) {
    codeToEval.push(
      `import React from "react";
        import ReactDOM from "react-dom";
        const App = __modules__["${fileStore.mainFile}"].default;
        ReactDOM.render(
          React.createElement(App, null),
          document.getElementById('app')
        );`
    );
  }

  for (let script of codeToEval) {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'module');
    const done = new Promise((resolve) => {
      iframeWindow[nextKey] = resolve;
    });
    // send ok in the module script to ensure sequential evaluation
    // of multiple proxy.eval() calls
    scriptEl.innerHTML = script + `\nwindow.${nextKey}()`;
    iframeDoc.head.appendChild(scriptEl);
    await done;
  }

  iframeDoc.close();
};
</script>

<template>
  <div class="code-sandbox-iframe-container" ref="previewDOM"></div>
</template>
