import { Editor } from 'codemirror';
import { ReplStore, StoreOptions } from '../core/store';
import { createCodeMirror } from './codemirror';
import { renderSandbox } from './sandbox';
import Splitter from './spliter';
import FileSelector from './file-selector';
import './code-sandbox.css';

interface CodeSandboxOptions {
  el: HTMLElement;
  options?: StoreOptions & {
    width?: string;
    height?: string;
  };
}
export default class CodeSandbox {
  el: HTMLElement;
  store: ReplStore;
  editor: Editor;
  constructor({ el, options }: CodeSandboxOptions) {
    this.el = el;
    this.store = new ReplStore(options);
    this.init();
  }

  init() {
    this.createContainer();
    this.createCodeMirror();
    this.createFileSelector();
    this.createIframeSandbox();
    this.createSplitter();
  }

  createContainer() {
    const container = document.createElement('div');
    container.classList.add('code-sandbox-split-pane');
    container.id = '__split-pane';
    container.innerHTML = `
      <div class="code-sandbox-split-pane-left" id="__split-pane-left">
        <div id="__editor">
          <div id="__file-selector"></div>
          <div id="__code-editor"></div>
        </div>
        <div class="code-sandbox-dragger" id="__dragger"></div>
      </div>
      <div class="code-sandbox-split-pane-right" id="__split-pane-right"></div>
    `;
    this.el.append(container);
  }

  createFileSelector() {
    new FileSelector({
      store: this.store,
      el: this.el.querySelector('#__file-selector') as HTMLElement,
      editorInstance: this.editor,
    });
  }

  createCodeMirror() {
    const mirrorContainer = this.el.querySelector(
      '#__code-editor'
    ) as HTMLElement;
    this.editor = createCodeMirror(mirrorContainer, {
      store: this.store,
    });

    this.editor.on('change', (instance) => {
      this.store.state.files[this.store.state.activeFile.filename].code =
        instance.getValue();
      this.createIframeSandbox();
    });
  }

  createIframeSandbox() {
    const sandbox = this.el.querySelector('#__split-pane-right') as HTMLElement;
    renderSandbox(sandbox, this.store);
  }

  createSplitter() {
    const el = this.el;
    new Splitter({
      elements: {
        left: el.querySelector('#__split-pane-left') as HTMLElement,
        right: el.querySelector('#__split-pane-right') as HTMLElement,
        container: el.querySelector('#__split-pane') as HTMLElement,
        el: el.querySelector('#__dragger') as HTMLElement,
      },
    });
  }
}
