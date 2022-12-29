import { modulesKey, exportKey, dynamicImportKey, nextKey } from '../constant';
import { ReplStore } from '../core/store';

interface IframeWindow extends Window {
  process: Record<string, any>;
  [modulesKey]: Record<string, any>;
  [exportKey]: Function;
  [dynamicImportKey]: Function;
  __next__: Function;
}

export const createSandbox = async (
  el: HTMLElement,
  store: ReplStore,
  modules: string[]
) => {
  const iframe = document.createElement('iframe');
  el.append(iframe);

  const iframeDoc = iframe.contentDocument as Document;
  const iframeWindow = iframe.contentWindow as IframeWindow;

  iframeWindow.process = { env: {} };
  iframeWindow[modulesKey] = {};
  iframeWindow[exportKey] = (mod, key, get) => {
    Object.defineProperty(mod, key, {
      enumerable: true,
      configurable: true,
      get,
    });
  };
  iframeWindow[dynamicImportKey] = (key) => {
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
