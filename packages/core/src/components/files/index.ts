import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state, queryAsync } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { File } from '@/utils';
import { MapFile, fileTypes, TooltipText } from '@/constant';
import JsSVG from '@/assets/js.svg';
import TsSVG from '@/assets/ts.svg';
import JsxSVG from '@/assets/jsx.svg';
import TsxSVG from '@/assets/tsx.svg';
import CssSVG from '@/assets/css.svg';
import HtmlSVG from '@/assets/html.svg';
import VueSVG from '@/assets/vue.svg';
import JsonSVG from '@/assets/json.svg';
import DefaultFileSVG from '@/assets/default_file.svg';
import style from './style.less?inline';

@customElement('code-sandbox-files')
export class CodeSandboxFiles extends LitElement {
  @property()
  files: Record<string, File>;
  @property()
  activeFile: File;
  @property()
  mainFile: string;
  @property()
  css: string = '';

  @state()
  showNewFile: boolean = false;
  @state()
  newFilename: string = '';
  @state()
  originFilename: string = '';

  @queryAsync('#new-filename-input')
  newFileInputRef: HTMLInputElement;

  selectFile(filename: string) {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['setActive', filename],
      })
    );
  }

  addFile() {
    if (this.validateFilenameError(this.newFilename) === null) {
      this.dispatchEvent(
        new CustomEvent('emitMethod', {
          detail: ['editFilename', this.newFilename, this.originFilename],
        })
      );
    }
    this.newFilename = '';
    this.originFilename = '';
    this.showNewFile = false;
  }

  deleteFile(filename: string) {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['deleteFile', filename],
      })
    );
  }

  resetHomeFile(filename: string) {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['resetHomeFile', filename],
      })
    );
  }

  async handleClickRenameFile(originFilename?: string) {
    this.originFilename = originFilename || '';
    this.newFilename = this.originFilename;
    this.showNewFile = true;
    const input = await this.newFileInputRef;
    input.value = this.originFilename;
    input.focus();
  }

  editFileName({ target }: { target: HTMLInputElement }) {
    this.newFilename = target.value;
  }

  editFileKeyDown({ key, target }: { key: string; target: HTMLInputElement }) {
    if (key === 'Enter') {
      target.blur();
    }
  }

  validateFilenameError(filename: string) {
    if (!filename || filename === this.originFilename) {
      return '';
    }
    if (this.files[filename]) {
      return `已存在同名文件 ${filename}`;
    }
    const fileType = fileTypes.some((type) => filename.endsWith(type));
    if (!fileType) {
      return `CodeSandbox 当前只支持 ${fileTypes
        .map((type) => `*${type}`)
        .join('、')} 类型的文件`;
    }
    return null;
  }

  getIcon(filename: string) {
    const suffix = filename.split('.')[1];
    if (suffix === 'js') {
      return JsSVG;
    } else if (suffix === 'ts') {
      return TsSVG;
    } else if (suffix === 'css') {
      return CssSVG;
    } else if (suffix === 'html') {
      return HtmlSVG;
    } else if (suffix === 'vue') {
      return VueSVG;
    } else if (suffix === 'jsx') {
      return JsxSVG;
    } else if (suffix === 'tsx') {
      return TsxSVG;
    } else if (suffix === 'json') {
      return JsonSVG;
    } else {
      return DefaultFileSVG;
    }
  }

  renderFileList = () =>
    repeat(
      [...Object.keys(this.files).filter((file) => file !== MapFile), MapFile],
      (file) => file,
      (filename) =>
        this.originFilename === filename
          ? this.renderFilenameInput()
          : html`<div
              class=${filename === this.activeFile.filename
                ? 'file-item active-file-item'
                : 'file-item'}
              @click=${() => this.selectFile(filename)}
            >
              <div class="file-left">
                <img class="file-item-icon" src="${this.getIcon(filename)}" />
                <div class="file-item-name">${filename}</div>
              </div>
              ${filename !== MapFile && !this.showNewFile
                ? html`<div class="file-right">
                    ${this.renderRenameFileBtn(
                      filename
                    )}${this.renderDeleteFileBtn(
                      filename
                    )}${this.renderHomeFileBtn(filename)}
                  </div>`
                : null}
            </div> `
    );

  renderFilenameInput = () => {
    const newFileError = this.validateFilenameError(this.newFilename);
    return this.showNewFile
      ? html`<div class="new-file-container">
          <input
            id="new-filename-input"
            class="new-file-input"
            @input=${this.editFileName}
            @keydown=${this.editFileKeyDown}
            @blur=${this.addFile}
          />
          ${newFileError &&
          html`<div class="new-file-error">${newFileError}</div>`}
        </div>`
      : null;
  };

  renderAddFileBtn = () => html`
    <div
      data-toggle="tooltip"
      title="${TooltipText.AddFile}"
      class="operate-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="14"
        width="14"
        class="file-option-button"
        @click=${() => this.handleClickRenameFile('')}
      >
        <path
          fill="currentColor"
          d="M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992zM11 11V8h2v3h3v2h-3v3h-2v-3H8v-2h3z"
        />
      </svg>
    </div>
  `;

  renderRenameFileBtn = (filename: string) => html`
    <div
      data-toggle="tooltip"
      title="${TooltipText.RenameFile}"
      class="operate-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        class="file-option-button"
        @click=${() => this.handleClickRenameFile(filename)}
      >
        <path
          fill="currentColor"
          d="M5 19h1.414l9.314-9.314-1.414-1.414L5 17.586V19zm16 2H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L9.243 19H21v2zM15.728 6.858l1.414 1.414 1.414-1.414-1.414-1.414-1.414 1.414z"
        />
      </svg>
    </div>
  `;

  renderDeleteFileBtn = (filename: string) => html`
    <div
      data-toggle="tooltip"
      title="${TooltipText.DeleteFile}"
      class="operate-btn delete-operate ${this.mainFile === filename
        ? 'hide-file-operate'
        : ''}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        class="file-option-button"
        @click=${(e: MouseEvent) => {
          e.stopPropagation();
          this.deleteFile(filename);
        }}
      >
        <path
          fill="currentColor"
          d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
        />
      </svg>
    </div>
  `;

  renderHomeFileBtn = (filename: string) => html`
    <div
      data-toggle="tooltip"
      title="${this.mainFile === filename
        ? TooltipText.isEntry
        : TooltipText.SetEntry}"
      class="operate-btn home-operate"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        class="file-option-button ${this.mainFile === filename
          ? 'current-home-operate'
          : ''}"
        @click=${(e: MouseEvent) => {
          e.stopPropagation();
          this.resetHomeFile(filename);
        }}
      >
        <path
          fill="currentColor"
          d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19zm2-4h8v2H8v-2z"
        />
      </svg>
    </div>
  `;

  render() {
    return html`
      <style>
        ${this.css}
      </style>
      <div class="code-sandbox-files-container">
        <div class="files-container">
          <div class="files-head">
            <div class="files-head-left">FILES</div>
            <div class="files-head-right">${this.renderAddFileBtn()}</div>
          </div>
          ${!this.originFilename ? this.renderFilenameInput() : ''}
          <div class="files-list">${this.renderFileList()}</div>
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
    'code-sandbox-files': CodeSandboxFiles;
  }
}
