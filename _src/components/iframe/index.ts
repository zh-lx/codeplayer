import {
  LitElement,
  css,
  html,
  PropertyValues,
  PropertyValueMap,
  TemplateResult,
} from 'lit';
import {
  customElement,
  property,
  query,
  state,
  queryAsync,
} from 'lit/decorators.js';
import { style } from './style';
import { ReplStore, StoreOptions, compileModulesForPreview } from '../../utils';
import {
  modulesKey,
  exportKey,
  dynamicImportKey,
  nextKey,
} from '../../constant';

interface IframeWindow extends Window {
  process: Record<string, any>;
  [modulesKey]: Record<string, any>;
  [exportKey]: Function;
  [dynamicImportKey]: Function;
  __next__: Function;
}

@customElement('iframe-sandbox')
export class IframeSandbox extends LitElement {
  @property()
  store: ReplStore;

  @query('#code-sandbox-iframe')
  iframeRef: HTMLIFrameElement;

  @state()
  scripts: TemplateResult[] = [];

  // protected willUpdate(_changedProperties: PropertyValueMap<this>) {
  //   if (_changedProperties.has('store') && !!this.store) {
  //     this.renderSandbox();
  //   }
  // }

  updated() {
    console.log(this.store, this.iframeRef);
    this.renderSandbox();
  }

  async renderSandbox() {
    const modules = compileModulesForPreview(this.store);

    const iframeWindow = this.iframeRef.contentWindow as IframeWindow;

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

    const codeToEval = [
      `window.__modules__ = {}\nwindow.__css__ = ''\n` +
        `if (window.__app__) window.__app__.unmount()\n` +
        `document.body.innerHTML = '<div id="app"></div>'`,
      ...modules,
      `document.getElementById('__sfc-styles').innerHTML = window.__css__`,
    ];

    // if main file is a vue file, mount it.
    if (this.store.state.mainFile.endsWith('.vue')) {
      codeToEval.push(
        `import { createApp as _createApp } from "vue"
          const _mount = () => {
              const AppComponent = __modules__["${this.store.state.mainFile}"].default
              AppComponent.name = 'Repl'
              const app = window.__app__ = _createApp(AppComponent)
              app.config.unwrapInjectedRef = true
              app.config.errorHandler = e => console.error(e)
              app.mount('#app')
            };
          _mount();`
      );
    }

    this.scripts = [];
    for (let script of codeToEval) {
      // const scriptEl = document.createElement('script');
      // scriptEl.setAttribute('type', 'module');
      const done = new Promise((resolve) => {
        iframeWindow[nextKey] = resolve;
      });
      const scriptEL = html`<script type="module">
        ${script + `\nwindow.${nextKey}()`};
      </script>`;
      this.scripts.push(scriptEL);
      await done;
    }
  }

  render() {
    return html`
      <iframe class="code-sandbox-iframe" id="code-sandbox-iframe">
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Code Sandbox Preview</title>
            <style id="__sfc-styles"></style>
            <script
              async
              src="https://unpkg.com/es-module-shims@1.5.18/dist/es-module-shims.wasm.js"
            ></script>
            <script type="importmap">
              ${this.store.getImportMap()}
            </script>
            ${this.scripts}
          </head>
          <body></body>
        </html>
      </iframe>
    `;
  }

  static styles = style;
}

declare global {
  interface HTMLElementTagNameMap {
    'iframe-sandbox': IframeSandbox;
  }
}
