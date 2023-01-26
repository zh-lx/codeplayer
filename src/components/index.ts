import { LitElement, html, PropertyValueMap, css, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@/components/editor';
import '@/components/iframe';
import '@/components/splitter';
import '@/components/files';
import '@/components/header';
import { File, atou, getTemplate } from '@/utils';
import { MapFile } from '@/constant';
import { CodeSandboxOptions } from '../index';
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
  @property()
  customStyle: string;

  @state()
  mainFile: string; // 主入口文件名
  @state()
  files: Record<string, File>; // 文件集合
  @state()
  activeFile: File; // 当前文件
  @state()
  _showFiles = true;
  @state()
  _showCode = true;
  @state()
  _showPreview = true;
  @state()
  _showHeader = true;

  @query('#code-sandbox-iframe')
  codeSandboxIframeRef: any;

  // firstUpdated() {
  //   document.addEventListener('keydown', (e) => console.log(e, 111));
  // }

  _initializeOptions() {
    let {
      initFiles,
      mainFile,
      imports,
      appType,
      showCodeEditor = true,
      showFiles = true,
      showHeader = true,
      showWebPreview = true,
    } = this.options;
    const serializedState = new URLSearchParams(location.search).get('_code');
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
    this._showFiles = showFiles;
    this._showCode = showCodeEditor;
    this._showPreview = showWebPreview;
    this._showHeader = showHeader;
  }

  toggle(show: '_showFiles' | '_showCode' | '_showPreview' | '_showHeader') {
    this[show] = !this[show];
  }

  setActive(filename: string) {
    this.activeFile = this.files[filename];
  }

  setCode(code: string) {
    this.activeFile.code = code;
    this.renderSandbox();
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

  protected async willUpdate(_changedProperties: PropertyValueMap<this>) {
    if (_changedProperties.has('options')) {
      this._initializeOptions();
    }
  }

  render() {
    return html`
      <div
        class="code-sandbox"
        style="height: ${this.height !== undefined
          ? this.height + 'px'
          : 'auto'}"
      >
        ${this._showHeader
          ? html`<code-sandbox-header
              @emitMethod=${this.emitMethod}
              .showFiles=${this._showFiles}
              .showCode=${this._showCode}
              .showPreview=${this._showPreview}
              .showHeader=${this._showHeader}
              .excludes=${this.options?.excludeControls || []}
            ></code-sandbox-header>`
          : null}
        <div class="code-sandbox-content">
          <code-sandbox-splitter
            initialSplit="124px"
            min="124px"
            max="240px"
            .closable=${true}
            .showLeft=${this._showFiles}
          >
            <code-sandbox-files
              slot="code-sandbox-splitter-left"
              .files=${this.files}
              .activeFile=${this.activeFile}
              .mainFile=${this.mainFile}
              @emitMethod=${this.emitMethod}
            ></code-sandbox-files>
            <code-sandbox-splitter
              slot="code-sandbox-splitter-right"
              min="30%"
              max="70%"
              .closable=${true}
              .showLeft=${this._showCode}
              .showRight=${this._showPreview}
            >
              <div class="split-left" slot="code-sandbox-splitter-left">
                <div class="code-editor-container">
                  <div id="__file-selector"></div>
                  <code-editor
                    .activeFile=${this.activeFile}
                    @emitMethod=${this.emitMethod}
                  ></code-editor>
                </div>
                <div class="code-sandbox-dragger" id="__dragger"></div>
              </div>
              <div class="split-right" slot="code-sandbox-splitter-right">
                <code-sandbox-iframe
                  id="code-sandbox-iframe"
                  .mainFile=${this.mainFile}
                  .files=${this.files}
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
