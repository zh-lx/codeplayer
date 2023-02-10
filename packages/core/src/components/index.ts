import { LitElement, html, PropertyValueMap, css, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@/components/editor';
import '@/components/iframe';
import '@/components/splitter';
import '@/components/files';
import '@/components/header';
import { File, atou, getTemplate, utoa, message } from '@/utils';
import { MapFile, URLCodeKey } from '@/constant';
import { CodeSandboxOptions, ToolbarPosition } from '../index';
import style from './style.less?inline';

@customElement('code-sandbox')
export class CodeSandbox extends LitElement {
  constructor() {
    super();
  }

  @property()
  height: number; // 默认高度
  @property()
  options: CodeSandboxOptions = {};

  @state()
  css: string = '';
  @state()
  mainFile: string; // 主入口文件名
  @state()
  files: Record<string, File>; // 文件集合
  @state()
  activeFile: File; // 当前文件
  @state()
  showFiles = true; // 显示文件栏
  @state()
  showCode = true; // 显示代码
  @state()
  showPreview = true; // 是否展示 web preview
  @state()
  showToolbar = true; // 是否展示工具栏
  @state()
  toolbarPosition: ToolbarPosition = 'top'; // 工具栏位置
  @state()
  vertical = false; // 是否垂直布局
  @state()
  reverse = false; // 是否翻转 code editor 和 web preview 的位置

  @query('#code-sandbox-iframe')
  codeSandboxIframeRef: any;
  @query('#code-editor')
  codeEditorRef: any;
  @query('#code-preview-splitter')
  swapRef: any;

  _initializeOptions() {
    let {
      initFiles,
      mainFile,
      imports,
      appType,
      showCodeEditor = true,
      showFiles = true,
      showToolbar = true,
      showWebPreview = true,
      toolbarPosition = 'top',
      vertical = false,
      reverse = false,
    } = this.options;
    const serializedState = new URLSearchParams(location.search).get(
      URLCodeKey
    );
    if (serializedState) {
      initFiles = JSON.parse(atou(serializedState));
    }
    initFiles = initFiles || getTemplate(appType || '');

    // 初始化 files
    let files: Record<string, File> = {};
    if (initFiles) {
      for (const filename in initFiles) {
        files[filename] = new File(filename, initFiles[filename]);
      }
    } else if (serializedState) {
      // 将 { filename: code } 格式的压缩后字符串转换为 utf8 JSON字符串
      const saved = JSON.parse(atou(serializedState));
      for (const filename in saved) {
        files[filename] = new File(filename, saved[filename]);
      }
    }

    this.files = files;
    this.mainFile = mainFile || Object.keys(files)[0];
    this.activeFile = files[this.mainFile];

    // 初始化 imports
    if (imports) {
      this.files[MapFile] = new File(
        MapFile,
        JSON.stringify({ imports }, null, 2)
      );
    }

    // 初始化可视区
    this.showFiles = showFiles;
    this.showCode = showCodeEditor;
    this.showPreview = showWebPreview;
    this.showToolbar = showToolbar;
    this.vertical = vertical;
    this.toolbarPosition = toolbarPosition;
    this.reverse = reverse;
    this.css = this.options?.css || '';
  }

  toggle(
    show: 'showFiles' | 'showCode' | 'showPreview' | 'showToolbar' | 'reverse'
  ) {
    this[show] = !this[show];
    // 交换 code editor 和 web preview 位置的宽度
    if (show === 'reverse') {
      this.swapRef.swap();
    }
  }

  setActive(filename: string) {
    this.activeFile = this.files[filename];
  }

  setCode(code: string) {
    this.activeFile.code = code;
    this.changeSerializedState();
    this.renderSandbox();
  }

  changeSerializedState() {
    const _files: Record<string, string> = {};
    Object.keys(this.files).forEach((filename) => {
      _files[filename] = this.files[filename].code;
    });
    const str = utoa(JSON.stringify(_files));
    const params = new URLSearchParams(location.search);
    params.set(URLCodeKey, str);
    history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  }

  copyCode() {
    try {
      const code = this.codeEditorRef.getCode();
      navigator.clipboard.writeText(code);
      message('代码已复制至剪切板', { type: 'success' });
    } catch (error) {
      message('复制失败: ' + String(error), { type: 'danger' });
    }
  }

  editFilename(newFilename: string, oldFilename: string) {
    if (!oldFilename) {
      // add a new file
      const file = new File(newFilename, '');
      this.files[newFilename] = file;
      this.setActive(newFilename);
    } else {
      // rename filename
      const tempFiles = {
        ...this.files,
        [newFilename]: { ...this.files[oldFilename], filename: newFilename },
      };
      delete tempFiles[oldFilename];
      this.files = tempFiles;

      this.setActive(newFilename);
      if (oldFilename === this.mainFile) {
        this.mainFile = newFilename;
      }
    }
  }

  deleteFile(filename: string) {
    if (confirm(`确定要删除 ${filename} 吗?`)) {
      if (this.activeFile.filename === filename) {
        this.activeFile = this.files[this.mainFile];
      }
      const tempFiles = { ...this.files };
      delete tempFiles[filename];
      this.files = tempFiles;
    }
  }

  resetHomeFile(filename: string) {
    if (confirm(`是否要将入口文件修改为 ${filename}?`)) {
      this.mainFile = filename;
      this.activeFile = this.files[filename];
    }
  }

  emitMethod(e: CustomEventInit) {
    const [fn, ...args] = e.detail;
    // @ts-ignore
    const result = this[fn](...args);
    return result;
  }

  renderSandbox() {
    this.codeSandboxIframeRef.renderSandbox();
  }

  setState(state: 'toolbarPosition', value: any) {
    this[state] = value;
  }

  protected async willUpdate(_changedProperties: PropertyValueMap<this>) {
    if (_changedProperties.has('options')) {
      this._initializeOptions();
    }
  }

  render() {
    return html`
      <style>
        ${this.css}
      </style>
      <div
        class="code-sandbox"
        style="height: ${this.height !== undefined
          ? this.height + 'px'
          : 'auto'}"
      >
        ${this.showToolbar
          ? html`<code-sandbox-header
              class="${this.toolbarPosition === 'top'
                ? 'header-top'
                : 'header-bottom'}"
              @emitMethod=${this.emitMethod}
              .editor=${this.codeEditorRef}
              .showFiles=${this.showFiles}
              .showCode=${this.showCode}
              .showPreview=${this.showPreview}
              .showToolbar=${this.showToolbar}
              .excludes=${this.options?.excludeTools || []}
              .toolbarPosition=${this.toolbarPosition}
              .vertical=${this.vertical}
              .css=${this.css}
            ></code-sandbox-header>`
          : null}
        <div
          class="code-sandbox-content ${this.toolbarPosition === 'top'
            ? 'content-bottom'
            : 'content-top'}"
        >
          <code-sandbox-splitter
            initialSplit="124px"
            min="124px"
            max="240px"
            .closable=${true}
            .showLeft=${this.showFiles}
            .css=${this.css}
          >
            <code-sandbox-files
              slot="code-sandbox-splitter-left"
              .files=${this.files}
              .activeFile=${this.activeFile}
              .mainFile=${this.mainFile}
              @emitMethod=${this.emitMethod}
              .css=${this.css}
            ></code-sandbox-files>
            <code-sandbox-splitter
              id="code-preview-splitter"
              slot="code-sandbox-splitter-right"
              min="30%"
              max="70%"
              .vertical=${this.vertical}
              .closable=${true}
              .showLeft=${this.reverse ? this.showPreview : this.showCode}
              .showRight=${this.reverse ? this.showCode : this.showPreview}
              .css=${this.css}
            >
              <div
                class="split-left"
                slot="code-sandbox-splitter-${this.reverse ? 'right' : 'left'}"
              >
                <div class="code-editor-container">
                  <div id="__file-selector"></div>
                  <code-editor
                    id="code-editor"
                    .activeFile=${this.activeFile}
                    @emitMethod=${this.emitMethod}
                    .css=${this.css}
                  ></code-editor>
                </div>
              </div>
              <div
                class="split-right"
                slot="code-sandbox-splitter-${this.reverse ? 'left' : 'right'}"
              >
                <code-sandbox-iframe
                  id="code-sandbox-iframe"
                  .mainFile=${this.mainFile}
                  .files=${this.files}
                  .css=${this.css}
                ></code-sandbox-iframe>
              </div>
            </code-sandbox-splitter>
          </code-sandbox-splitter>
        </div>
      </div>
    `;
  }

  static styles = css`
    ${unsafeCSS(style)}
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'code-sandbox': CodeSandbox;
  }
}
