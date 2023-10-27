import { Hooks } from '@/compiler/type';
import { modulesKey, exportKey, dynamicImportKey, nextKey } from '@/constant';

let count = 0;
let nextIndex = 0;

async function emitHtml(content: {
  modules: string[];
  styles: string[];
  importMap: string;
  iframe: HTMLIFrameElement;
  render: boolean;
  links: string[];
}) {
  const { modules, styles, importMap, iframe, render, links } = content;
  count++;
  const currentCount = count;

  let iframeDoc = iframe.contentDocument as Document;
  let iframeWindow = iframe.contentWindow as any;
  iframeWindow[nextKey] = [];

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
        <script type="importmap">\n${importMap}</script>
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>
    `;
    iframeDoc.write(template);
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
  } else {
    iframeDoc.body.innerHTML = '<div id="app"></div>';
  }

  // remove old code
  const els = Array.from(iframeDoc.head.querySelectorAll('[replace]'));
  els.reverse().forEach((el) => {
    el.remove();
  });

  const map = flattenScopeMappings(JSON.parse(importMap));
  // links
  for (let link of links) {
    for (let key in map) {
      if (link === key || `${link}/` === key) {
        const styleEl = document.createElement('link');
        styleEl.setAttribute('href', map[key]);
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('type', 'text/css');
        styleEl.setAttribute('replace', 'true');
        iframeDoc.head.appendChild(styleEl);
        break;
      } else if (link.startsWith(key) && key.endsWith('/')) {
        const href = map[key] + link.replace(key, '');
        const styleEl = document.createElement('link');
        styleEl.setAttribute('href', href);
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('type', 'text/css');
        styleEl.setAttribute('replace', 'true');
        iframeDoc.head.appendChild(styleEl);
        break;
      }
    }
  }

  // css
  const styleEl = document.createElement('style');
  styleEl.setAttribute('replace', 'true');
  styleEl.innerHTML = styles.join('\n');
  iframeDoc.head.appendChild(styleEl);

  modules.unshift(`import eruda from 'https://esm.sh/eruda@3.0.1';
  window.__eruda = eruda;
  eruda.init();`);

  async function loadScript(i: number) {
    if (currentCount !== count || i >= modules.length) {
      return;
    }
    let script = modules[i];
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'module');
    scriptEl.setAttribute('replace', 'true');
    const done = new Promise((resolve) => {
      iframeWindow[nextKey][nextIndex] = function () {
        resolve(true);
      };
    });
    // send ok in the module script to ensure sequential evaluation
    // of multiple proxy.eval() calls
    scriptEl.innerHTML = script + `\nwindow.${nextKey}[${nextIndex}] && window.${nextKey}[${nextIndex}]();`;
    nextIndex++;
    iframeDoc.head.appendChild(scriptEl);
    await done;
    loadScript(i + 1);
  }
  await loadScript(0);

  iframeDoc.close();
}

function flattenScopeMappings(importMap: any) {
  const flattenedMappings: Record<string, string> = {};

  for (let key in importMap.imports) {
    flattenedMappings[key] = importMap.imports[key];
  }

  for (const scopePrefix in importMap.scopes) {
    const scopeMappings = importMap.scopes[scopePrefix];
    for (const scopeModulePath in scopeMappings) {
      const fullPath = `${scopePrefix}${scopeModulePath}`;
      flattenedMappings[fullPath] = scopeMappings[scopeModulePath];
    }
  }

  return flattenedMappings;
}

export default function (hooks: Hooks) {
  hooks.hook('emit', emitHtml);
}
