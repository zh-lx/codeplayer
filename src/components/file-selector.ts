import { ReplStore } from '../core/store';
import './file-selector.css';
import { MapFile } from '../constant';
interface FileSelectorOptions {
  store: ReplStore;
  el: HTMLElement;
}

export default class FileSelector {
  store: ReplStore;
  el: HTMLElement;
  constructor(options: FileSelectorOptions) {
    this.store = options.store;
    this.el = options.el;
    this.init();
  }

  init() {
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
    this.el.append(selector);
  }

  createFileItem(name: string) {
    const fileItem = document.createElement('div');
    fileItem.className = 'code-sandbox-file-item';
    fileItem.innerText = name === MapFile ? 'ImportMap' : name;
    if (this.store.state.activeFile.filename === name) {
      fileItem.classList.add('code-sandbox-file-active-item');
    }
    return fileItem;
  }
}
