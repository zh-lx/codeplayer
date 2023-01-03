import { ReplStore } from '../core/store';

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
    for (let file in this.store.state.files) {
      const fileItem = createFileItem(file);
      this.el.append(fileItem as HTMLElement);
    }
  }
}

function createFileItem(name: string) {
  const fileItem = document.createElement('div');
  fileItem.className = 'code-sandbox-file-item';
  fileItem.innerText = name;
  return fileItem;
}
