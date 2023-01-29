import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { TooltipText } from '@/constant';
import type { Controls, ToolbarPosition } from '@/index';
import { message } from '@/utils';
import style from './style.less?inline';
import RightMenu from '@right-menu/core';

@customElement('code-sandbox-header')
export class CodeSandboxHeader extends LitElement {
  @property()
  showCode = true;
  @property()
  showFiles = true;
  @property()
  showPreview = true;
  @property()
  showToolbar = true;
  @property()
  excludes: Controls[] = [];
  @property()
  editor: any;
  @property()
  toolbarPosition: ToolbarPosition;
  @property()
  vertical: boolean;
  @property()
  customStyle: string = '';

  @query('#setting-icon')
  settingRef: HTMLDivElement;

  firstUpdated() {
    new RightMenu(
      { el: this.settingRef, mode: 'click', theme: 'mac', minWidth: '100px' },
      () => [
        {
          type: 'ul', // type为li是普通按钮
          text: '工具栏位置', // 按钮的名称
          children: [
            {
              type: 'li', // type为li是普通按钮
              text: '顶部', // 按钮的名称
              class: this.toolbarPosition === 'top' ? 'active-menu-item' : '',
              callback: () => this.changeParentState('toolbarPosition', 'top'),
            },
            {
              type: 'li', // type为li是普通按钮
              text: '底部', // 按钮的名称
              class:
                this.toolbarPosition === 'bottom' ? 'active-menu-item' : '',
              callback: () =>
                this.changeParentState('toolbarPosition', 'bottom'),
            },
          ],
        },
        {
          type: 'ul', // type为li是普通按钮
          text: '布局方式', // 按钮的名称
          children: [
            {
              type: 'li', // type为li是普通按钮
              text: '左右布局', // 按钮的名称
              class: this.vertical === false ? 'active-menu-item' : '',
              callback: () => this.changeParentState('vertical', false),
            },
            {
              type: 'li', // type为li是普通按钮
              text: '上下布局', // 按钮的名称
              class: this.vertical === true ? 'active-menu-item' : '',
              callback: () => this.changeParentState('vertical', true),
            },
          ],
        },
      ]
    );
  }

  changeParentState(state: string, value: any) {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['setState', state, value],
      })
    );
  }

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

  copyCode() {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['copyCode'],
      })
    );
  }

  sharePage() {
    const link = location.href;
    navigator.clipboard.writeText(link);
    message('已复制链接至剪切板', { type: 'success' });
  }

  toggle(
    show: 'showFiles' | 'showCode' | 'showPreview' | 'showToolbar' | 'reverse'
  ) {
    this.dispatchEvent(
      new CustomEvent('emitMethod', {
        detail: ['toggle', show],
      })
    );
  }

  renderSettingToggle = () =>
    this.excludes.includes('header')
      ? null
      : html`
          <div
            id="setting-icon"
            class="header-icon header-toggle-icon ${this.active(
              this.showToolbar
            )}"
            data-toggle="tooltip"
            title="${TooltipText.Settings}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M2 12c0-.865.11-1.703.316-2.504A3 3 0 0 0 4.99 4.867a9.99 9.99 0 0 1 4.335-2.505 3 3 0 0 0 5.348 0 9.99 9.99 0 0 1 4.335 2.505 3 3 0 0 0 2.675 4.63c.206.8.316 1.638.316 2.503 0 .865-.11 1.703-.316 2.504a3 3 0 0 0-2.675 4.629 9.99 9.99 0 0 1-4.335 2.505 3 3 0 0 0-5.348 0 9.99 9.99 0 0 1-4.335-2.505 3 3 0 0 0-2.675-4.63C2.11 13.704 2 12.866 2 12zm4.804 3c.63 1.091.81 2.346.564 3.524.408.29.842.541 1.297.75A4.993 4.993 0 0 1 12 18c1.26 0 2.438.471 3.335 1.274.455-.209.889-.46 1.297-.75A4.993 4.993 0 0 1 17.196 15a4.993 4.993 0 0 1 2.77-2.25 8.126 8.126 0 0 0 0-1.5A4.993 4.993 0 0 1 17.195 9a4.993 4.993 0 0 1-.564-3.524 7.989 7.989 0 0 0-1.297-.75A4.993 4.993 0 0 1 12 6a4.993 4.993 0 0 1-3.335-1.274 7.99 7.99 0 0 0-1.297.75A4.993 4.993 0 0 1 6.804 9a4.993 4.993 0 0 1-2.77 2.25 8.126 8.126 0 0 0 0 1.5A4.993 4.993 0 0 1 6.805 15zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
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
            @click=${() => this.toggle('showFiles')}
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
            @click=${() => this.toggle('showCode')}
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
            class="header-icon refresh-icon"
            data-toggle="tooltip"
            title=${TooltipText.RefreshWebPreview}
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

  renderShareIcon = () =>
    this.excludes.includes('share')
      ? null
      : html`
          <div
            class="header-icon refresh-icon"
            data-toggle="tooltip"
            title=${TooltipText.Share}
            @click=${this.sharePage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12l7-7z"
              />
            </svg>
          </div>
        `;

  renderLayoutIcon = () =>
    this.excludes.includes('layout')
      ? null
      : html`
          <div
            class="header-icon swap-icon"
            data-toggle="tooltip"
            title=${TooltipText.SwapLayout}
            @click=${() => this.toggle('reverse')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M4 5v14h16V5H4zM3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm12 4l3.5 3-3.5 3v-2h-4V9h4V7zM9 17l-3.5-3L9 11v2h4v2H9v2z"
              />
            </svg>
          </div>
        `;

  renderCopyIcon = () =>
    this.excludes.includes('layout')
      ? null
      : html`
          <div
            class="header-icon copy-icon"
            data-toggle="tooltip"
            title=${TooltipText.CopyCode}
            @click=${this.copyCode}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="15"
            >
              <path
                fill="currentColor"
                d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z"
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
            @click=${() => this.toggle('showPreview')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                fill="currentColor"
                d="M18.159 10A6.002 6.002 0 0 0 6.84 10H18.16zM6.583 13a6.002 6.002 0 0 0 11.08 2.057h3.304A9.003 9.003 0 0 1 8.612 20.12c-2.744 1.491-5.113 1.8-6.422.491-1.344-1.34-.628-4.851 1.313-8.373a23.624 23.624 0 0 1 2.499-3.665c.359-.433.735-.852 1.125-1.252-.275.055-1.88.851-3.412 2.714a9.004 9.004 0 0 1 9.468-7.009c3.095-1.402 5.974-1.726 7.192-.51 1.125 1.123 1.062 2.995.125 5.242-.01.021-.018.043-.027.064A8.96 8.96 0 0 1 21.5 12c0 .338-.019.672-.055 1H6.583zm1.422 6.799a9.03 9.03 0 0 1-3.972-4.742c-1.161 2.282-1.46 4.19-.469 5.18.813.812 2.438.624 4.438-.436l.003-.002zM20.172 7.292a8.19 8.19 0 0 1 .015-.034c.75-1.622.813-2.994.125-3.806-.869-.868-2.54-.75-4.522.168a9.032 9.032 0 0 1 4.382 3.672z"
              />
            </svg>
          </div>
        `;

  render() {
    return html`
      <style>
        ${this.customStyle}
      </style>
      <div class="code-sandbox-header">
        <div class="header-left">${this.renderSettingToggle()}</div>
        <div class="header-right">
          ${this.renderFilesToggle()}${this.renderCodeToggle()}
          ${this.renderPreviewToggle()}${this.renderLayoutIcon()}${this.renderCopyIcon()}${this.renderRefreshIcon()}${this.renderShareIcon()}
        </div>
      </div>
    `;
  }

  static styles = css`
    ${unsafeCSS(style)}
  `;
}
