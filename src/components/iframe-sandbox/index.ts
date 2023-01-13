import {
  modulesKey,
  exportKey,
  dynamicImportKey,
  nextKey,
} from '../../constant';
import { ReplStore } from '../../core/store';
import { compileModulesForPreview } from '../../core/module-compiler';
import { renderIframeTip } from '../error-tip';

interface IframeWindow extends Window {
  process: Record<string, any>;
  [modulesKey]: Record<string, any>;
  [exportKey]: Function;
  [dynamicImportKey]: Function;
  __next__: Function;
}

export const renderSandbox = async (
  el: HTMLElement | string,
  store: ReplStore
) => {
  el =
    typeof el === 'string' ? (document.querySelector(el) as HTMLElement) : el;

  await store.init();

  const modules = compileModulesForPreview(store);

  if (store.state.errors.length) {
    console.error(store.state.errors);
    // renderErrorTip(store.state.errors, el);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.className = 'code-sandbox-iframe';

  if (el.querySelector('.code-sandbox-iframe')) {
    el.querySelector('.code-sandbox-iframe')?.remove();
  }
  el.append(iframe);

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
  iframeDoc.write(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Code Sandbox</title>
        <style id="__sfc-styles"></style>
        <script
          async
          src="https://unpkg.com/es-module-shims@1.5.18/dist/es-module-shims.wasm.js"
        ></script>
        <script type="importmap">
          ${JSON.stringify(store.getImportMap())}
        </script>
      </head>
      <body>
  
      </body>
    </html>
    `);

  const codeToEval = [
    `window.__modules__ = {}\nwindow.__css__ = ''\n` +
      `if (window.__app__) window.__app__.unmount()\n` +
      `document.body.innerHTML = '<div id="app"></div>'`,
    ...modules,
    `document.getElementById('__sfc-styles').innerHTML = window.__css__`,
  ];

  // if main file is a vue file, mount it.
  if (store.state.mainFile.endsWith('.vue')) {
    codeToEval.push(
      `import { createApp as _createApp } from "vue"
        const _mount = () => {
            const AppComponent = __modules__["${store.state.mainFile}"].default
            AppComponent.name = 'Repl'
            const app = window.__app__ = _createApp(AppComponent)
            app.config.unwrapInjectedRef = true
            app.config.errorHandler = e => console.error(e)
            app.mount('#app')
          };
        _mount();`
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
