import { LitElement, html, css, unsafeCSS, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { compileModulesForPreview, File } from '@/utils';
import {
  modulesKey,
  exportKey,
  dynamicImportKey,
  nextKey,
  MapFile,
} from '@/constant';
import { compileFile } from '@/transform';
import style from './style.less?inline';

interface IframeWindow extends Window {
  process: Record<string, any>;
  [modulesKey]: Record<string, any>;
  [exportKey]: Function;
  [dynamicImportKey]: Function;
  __next__: Function;
}

@customElement('code-sandbox-iframe')
export class IframeSandbox extends LitElement {
  @property()
  files: Record<string, File>;
  @property()
  mainFile: string;

  @state()
  errors: (string | Error)[]; // 编译错误

  @query('#iframe-container')
  iframeRef: HTMLIFrameElement;

  firstUpdated() {
    this.renderSandbox();
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has('files') && this.hasUpdated) {
      this.renderSandbox();
    }
  }

  async compileFiles() {
    const result = { errors: [] };
    const compileFilePromises = Promise.all(
      Object.keys(this.files).map((file) =>
        compileFile(result, this.files[file])
      )
    );
    await compileFilePromises;
    this.errors = result.errors;
  }

  getImportMap() {
    try {
      return JSON.parse(this.files[MapFile].code);
    } catch (e) {
      this.errors = [`Syntax error in ${MapFile}: ${(e as Error).message}`];
      return {};
    }
  }

  async renderSandbox() {
    await this.compileFiles();
    const modules = compileModulesForPreview(this.files, this.mainFile);
    // 建立一个新的 iframe
    this.iframeRef.querySelector('iframe')?.remove();
    const iframe = document.createElement('iframe');
    iframe.className = 'code-sandbox-iframe';
    this.iframeRef.append(iframe);

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
          rel"modulepreload"
          src="https://unpkg.com/es-module-shims@1.5.18/dist/es-module-shims.wasm.js"
        ></script>
        <script type="importmap">
          ${JSON.stringify(this.getImportMap())}
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
    if (this.mainFile.endsWith('.vue')) {
      codeToEval.push(
        `import { createApp as _createApp } from "vue"
        const _mount = () => {
            const AppComponent = __modules__["${this.mainFile}"].default
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
  }

  render() {
    return html`
      <div class="code-sandbox-iframe-container" id="iframe-container"></div>
    `;
  }

  static styles = css`
    ${unsafeCSS(style)}
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'code-sandbox-iframe': IframeSandbox;
  }
}
