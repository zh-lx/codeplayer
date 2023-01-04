import './code-sandbox.css';
import { ReplStore, StoreOptions } from '../core/store';
import { createCodeMirror } from './codemirror';
import { createSandbox } from './sandbox';
import Splitter from './spliter';
import FileSelector from './file-selector';

export const createCodeSandbox = (el: HTMLElement, options?: StoreOptions) => {
  const codeSandbox = document.createElement('div');
  codeSandbox.innerHTML = `
  <div class="code-sandbox-split-pane" id="__split-pane">
    <div class="code-sandbox-split-pane-left" id="__split-pane-left">
      <div id="__editor">
        <div id="__file-selector"></div>
        <div id="__code-editor"></div>
      </div>
      <div class="code-sandbox-dragger" id="__dragger"></div>
    </div>
    <div class="code-sandbox-split-pane-right" id="__split-pane-right"></div>
  </div>
  `;
  el.append(codeSandbox);

  const store = new ReplStore(options);

  // create Mirror
  const codeEditor = codeSandbox.querySelector('#__code-editor') as HTMLElement;
  const editorInstance = createCodeMirror(codeEditor, {
    store,
  });

  // create sandbox
  const sandbox = codeSandbox.querySelector(
    '#__split-pane-right'
  ) as HTMLElement;
  createSandbox(sandbox, store);

  // create file-selector
  new FileSelector({
    store,
    el: codeSandbox.querySelector('#__file-selector') as HTMLElement,
    editorInstance,
  });

  // create splitter
  new Splitter({
    elements: {
      left: codeSandbox.querySelector('#__split-pane-left') as HTMLElement,
      right: codeSandbox.querySelector('#__split-pane-right') as HTMLElement,
      container: codeSandbox.querySelector('#__split-pane') as HTMLElement,
      el: codeSandbox.querySelector('#__dragger') as HTMLElement,
    },
  });

  const resizeSplitPane = () => {};
};
