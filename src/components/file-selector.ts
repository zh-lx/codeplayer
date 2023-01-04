import { ReplStore } from '../core/store';
import './file-selector.css';
import { MapFile } from '../constant';
import { Editor } from 'codemirror';
import { getMode } from '../utils';
interface FileSelectorOptions {
  store: ReplStore;
  el: HTMLElement;
  editorInstance: Editor;
}

export default class FileSelector {
  store: ReplStore;
  el: HTMLElement;
  activeFileItem: HTMLElement;
  mainFileItem: HTMLElement;
  editorInstance: Editor;
  constructor(options: FileSelectorOptions) {
    this.store = options.store;
    this.el = options.el;
    this.editorInstance = options.editorInstance;
    this.init();
  }

  init() {
    const selectorLayout = this.createFileSelectorLayout();
    this.el.append(selectorLayout);
  }

  createFileSelectorLayout() {
    const selector = document.createElement('div');
    selector.classList.add('code-sandbox-file-selector');
    selector.innerHTML = `<div class="code-sandbox-file-selector-left"></div>
    <div class="code-sandbox-file-selector-right"></div>`;
    const left = selector.querySelector('.code-sandbox-file-selector-left');
    const right = selector.querySelector('.code-sandbox-file-selector-right');
    for (let file in this.store.state.files) {
      const fileItem = this.createFileItem(file) as HTMLElement;
      if (file === MapFile) {
        right?.append(fileItem);
      } else {
        left?.append(fileItem);
      }
    }
    return selector;
  }

  createFileItem(filename: string) {
    const fileItem = document.createElement('div');
    fileItem.className = 'code-sandbox-file-item';
    fileItem.innerHTML = `<span>${
      filename === MapFile ? 'ImportMap' : filename
    }</span>`;
    if (filename === MapFile) {
      fileItem.classList.add('code-sandbox-file-item-no-close');
    } else if (this.store.state.mainFile === filename) {
      this.mainFileItem = fileItem;
      fileItem.classList.add('code-sandbox-file-item-no-close');
    } else {
      fileItem.innerHTML += `<svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 14L34 34" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 34L34 14" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    }
    if (this.store.state.activeFile.filename === filename) {
      fileItem.classList.add('code-sandbox-file-active-item');
      this.activeFileItem = fileItem;
    }

    // 点击切换文件
    const clickFileItem = () => {
      if (fileItem === this.activeFileItem) {
        return;
      }
      this.activeFileItem.classList.remove('code-sandbox-file-active-item');
      fileItem.classList.add('code-sandbox-file-active-item');
      this.activeFileItem = fileItem;
      this.store.setActive(filename);
      this.editorInstance.setValue(this.store.state.activeFile.code);
      this.editorInstance.setOption('mode', getMode(filename));
    };

    // 点击删除按钮删除文件
    const deleteFile = () => {
      const confirm = window.confirm(`是否要删除 ${filename}?`);
      if (!confirm) {
        return;
      } else {
        fileItem.removeEventListener('click', clickFileItem);
        fileItem.remove();
        if (this.store.state.activeFile.filename === filename) {
          const mainFile = this.store.state.mainFile;
          this.store.setActive(mainFile);
          this.activeFileItem = this.mainFileItem;
          this.activeFileItem.classList.add('code-sandbox-file-active-item');
          this.editorInstance.setValue(this.store.state.activeFile.code);
          this.editorInstance.setOption('mode', getMode(filename));
        }
      }
    };

    fileItem.addEventListener('click', clickFileItem);
    fileItem.querySelector('svg')?.addEventListener('click', deleteFile);

    return fileItem;
  }
}
