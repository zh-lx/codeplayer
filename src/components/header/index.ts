import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TooltipText } from '@/constant';
import type { Controls } from '@/index';
import style from './style.less?inline';

@customElement('code-sandbox-header')
export class CodeSandboxHeader extends LitElement {
  @property()
  showCode = true;
  @property()
  showFiles = true;
  @property()
  showPreview = true;
  @property()
  showHeader = true;
  @property()
  excludes: Controls[] = [];

  active(show: boolean) {
    return !show ? 'disable-header-icon' : '';
  }

  refreshPreview() {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['renderSandbox'],
      })
    );
  }

  toggle(show: '_showFiles' | '_showCode' | '_showPreview' | '_showHeader') {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['toggle', show],
      })
    );
  }

  renderHeaderToggle = () =>
    this.excludes.includes('header')
      ? null
      : html`
          <div
            class="header-icon header-toggle-icon ${this.active(
              this.showHeader
            )}"
            data-toggle="tooltip"
            title="${TooltipText.ToggleHeader(this.showHeader)}"
            @click=${() => this.toggle('_showHeader')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zM9 6h2v2H9V6zM5 6h2v2H5V6z"
              />
            </svg>
          </div>
        `;

  renderFilesToggle = () =>
    this.excludes.includes('files')
      ? null
      : html`
          <div
            class="header-icon files-toggle-icon ${this.active(this.showFiles)}"
            data-toggle="tooltip"
            title="${TooltipText.ToggleFiles(this.showFiles)}"
            @click=${() => this.toggle('_showFiles')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM7 5H4v14h3V5zm13 0H9v14h11V5z"
              />
            </svg>
          </div>
        `;

  renderCodeToggle = () =>
    this.excludes.includes('codeEditor')
      ? null
      : html`
          <div
            class="header-icon code-toggle-icon ${this.active(this.showCode)}"
            data-toggle="tooltip"
            title="${TooltipText.ToggleCode(this.showCode)}"
            @click=${() => this.toggle('_showCode')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm16 7l-3.536 3.536-1.414-1.415L17.172 12 15.05 9.879l1.414-1.415L20 12zM6.828 12l2.122 2.121-1.414 1.415L4 12l3.536-3.536L8.95 9.88 6.828 12zm4.416 5H9.116l3.64-10h2.128l-3.64 10z"
              />
            </svg>
          </div>
        `;

  renderRefreshIcon = () =>
    this.excludes.includes('refresh')
      ? null
      : html`
          <div
            class="header-icon"
            data-toggle="tooltip"
            title="Refresh Web Preview"
            @click=${this.refreshPreview}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M18.537 19.567A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3a8 8 0 1 0-2.46 5.772l.997 1.795z"
              />
            </svg>
          </div>
        `;

  renderPreviewToggle = () =>
    this.excludes.includes('webPreview')
      ? null
      : html`
          <div
            class="header-icon preview-toggle-icon ${this.active(
              this.showPreview
            )}"
            data-toggle="tooltip"
            title="${TooltipText.ToggleWebPreview(this.showPreview)}"
            @click=${() => this.toggle('_showPreview')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm-6 2H4v14h11V5zm5 0h-3v14h3V5z"
              />
            </svg>
          </div>
        `;

  render() {
    return html`
      <div class="code-sandbox-header">
        <div class="header-left">
          ${this.renderHeaderToggle()}${this.renderFilesToggle()}${this.renderCodeToggle()}
          ${this.renderPreviewToggle()}
        </div>
        <div class="header-right">${this.renderRefreshIcon()}</div>
      </div>
    `;
  }

  static styles = css`
    ${unsafeCSS(style)}
  `;
}
