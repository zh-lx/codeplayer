import { ReplStore } from '../core/store';
import './file-selector.css';
import { MapFile } from '../constant';
import { Editor } from 'codemirror';
import { getMode, validateFile } from '../utils';
interface FileSelectorOptions {
  store: ReplStore;
  el: HTMLElement;
  editorInstance: Editor;
}

export default class FileSelector {
  store: ReplStore;
  el: HTMLElement;
  editorInstance: Editor;
  fileInput: HTMLInputElement | null;
  fileMap: Record<string, HTMLElement>;
  constructor(options: FileSelectorOptions) {
    this.fileMap = {};
    this.store = options.store;
    this.el = options.el;
    this.editorInstance = options.editorInstance;
    this.fileInput = null;
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
    const left = selector.querySelector(
      '.code-sandbox-file-selector-left'
    ) as HTMLElement;
    const right = selector.querySelector('.code-sandbox-file-selector-right');
    for (let file in this.store.state.files) {
      const fileItem = this.createFileItem(file) as HTMLElement;
      if (file === MapFile) {
        right?.append(fileItem);
      } else {
        left?.append(fileItem);
      }
    }
    this.fileMap[this.store.state.activeFile.filename].classList.add(
      'code-sandbox-file-active-item'
    );
    this.createAddFileButton(left);
    return selector;
  }

  createFileItem(filename: string) {
    const fileItem = document.createElement('div');
    fileItem.className = 'code-sandbox-file-item';
    fileItem.innerHTML = `<span>${
      filename === MapFile ? 'ImportMap' : filename
    }</span>`;
    if (filename === MapFile || filename === this.store.state.mainFile) {
      fileItem.classList.add('code-sandbox-file-item-no-close');
    } else {
      fileItem.innerHTML += `<svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 14L34 34" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 34L34 14" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    }
    this.fileMap[filename] = fileItem;

    // 点击选择当前文件
    const clickFileItem = () => {
      this.selectFile(filename);
    };

    // 点击删除按钮删除文件
    const deleteFile = () => {
      const confirm = window.confirm(`是否要删除 ${filename}?`);
      if (!confirm) {
        return;
      } else {
        fileItem.remove();
        if (this.store.state.activeFile.filename === filename) {
          this.selectFile(this.store.state.mainFile);
        }
      }
    };

    fileItem.addEventListener('click', clickFileItem);
    fileItem.querySelector('svg')?.addEventListener('click', deleteFile);

    return fileItem;
  }

  // 选择文件高亮并展示其代码
  selectFile(filename: string) {
    if (filename === this.store.state.activeFile.filename) {
      return;
    }
    const activeFileItem = this.el.querySelector(
      '.code-sandbox-file-active-item'
    );
    activeFileItem?.classList.remove('code-sandbox-file-active-item');
    this.fileMap[filename].classList.add('code-sandbox-file-active-item');
    this.store.setActive(filename);
    this.editorInstance.setValue(this.store.state.activeFile.code);
    this.editorInstance.setOption('mode', getMode(filename));
  }

  // 添加文件
  createAddFileButton(parentNode: HTMLElement) {
    const button = document.createElement('div');
    button.classList.add('code-sandbox-add-file-button');
    button.id = '__add-file-button';
    button.innerHTML = `
    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 44H38C39.1046 44 40 43.1046 40 42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z" fill="none" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 4L40 14" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M24 21V35" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 28H24L31 28" stroke="#606266" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    button.addEventListener('click', () => {
      if (!this.fileInput) {
        this.fileInput = this.createFilenameInput(parentNode);
        parentNode.insertBefore(this.fileInput, button);
      }
      this.fileInput.focus();
    });
    parentNode.append(button);
  }

  // 文件名添加输入框
  createFilenameInput(parentNode: HTMLElement) {
    const input = document.createElement('input');
    input.classList.add('code-sandbox-filename-input');
    input.placeholder = '请输入新文件名';
    input.addEventListener('blur', () => {
      const filename = input.value;
      const validate = validateFile(filename, this.fileMap);
      if (validate) {
        this.fileInput = null;
        this.store.addFile(filename);
        const newFileItem = this.createFileItem(filename);
        parentNode.insertBefore(newFileItem, input);
        input.remove();
        this.selectFile(filename);
      }
    });
    return input;
  }
}
