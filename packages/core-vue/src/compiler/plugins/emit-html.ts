import { Hooks } from '@/compiler/type';
import { modulesKey, exportKey, dynamicImportKey, nextKey } from '@/constant';

async function emitHtml(content: {
  modules: string[];
  styles: string[];
  importMap: string;
  iframe: HTMLIFrameElement;
  render: boolean;
}) {
  const { modules, styles, importMap, iframe, render } = content;

  let iframeDoc = iframe.contentDocument as Document;
  let iframeWindow = iframe.contentWindow as any;

  if (!iframeDoc) {
    return;
  }

  if (render) {
    const template = `
    <!DOCTYPE html>
    <html lang="en">
      <head id="cs-ide-head">
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CS-IDE</title>
        <script
        async
        rel"modulepreload"
        src="https://unpkg.com/es-module-shims@1.5.18/dist/es-module-shims.wasm.js"
        ></script>
        <script type="importmap">\n${importMap}</script>
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>
    `;
    iframeDoc.write(template);
    iframeWindow.process = { env: {} };
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
  } else {
    iframeDoc.body.innerHTML = '<div id="app"></div>';
  }

  // remove old code
  const els = Array.from(iframeDoc.head.querySelectorAll('[replace]'));
  els.reverse().forEach((el) => {
    el.remove();
  });

  // css
  for (let style of styles) {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('replace', 'true');
    styleEl.innerHTML = style;
    iframeDoc.head.appendChild(styleEl);
  }

  const codeToEval = ['window.__modules__ = {};\n', ...modules];

  for (let script of codeToEval) {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'module');
    scriptEl.setAttribute('replace', 'true');
    const done = new Promise((resolve) => {
      iframeWindow[nextKey] = resolve;
    });
    // send ok in the module script to ensure sequential evaluation
    // of multiple proxy.eval() calls
    scriptEl.innerHTML = script + `\nwindow.${nextKey}();`;
    iframeDoc.head.appendChild(scriptEl);
    await done;
  }
}

export default function (hooks: Hooks) {
  hooks.hook('emit', emitHtml);
}
