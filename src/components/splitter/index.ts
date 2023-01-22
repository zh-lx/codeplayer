import { LitElement, html, css, unsafeCSS, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { convertToNumber } from '@/utils';
import style from './style.less?inline';

@customElement('code-sandbox-splitter')
export class CodeSandboxSplitter extends LitElement {
  @property()
  vertical = false;
  @property()
  initialSplit = '50%';
  @property()
  min = '20%';
  @property()
  max = '80%';
  @property()
  closable: boolean = false;

  @state()
  split = '0'; // 左侧所占百分比
  @state()
  isDrag = false;
  @state()
  startPosition = 0;
  @state()
  startSplit = 0;
  @state()
  showMask = false;
  @state()
  maps = { left: {}, right: {} };

  @query('#code-sandbox-splitter')
  splitterContainer: HTMLDivElement;

  firstUpdated() {
    this.split = this.initialSplit;
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has('split') && this.hasUpdated) {
      const attr = this.vertical ? 'height' : 'width';
      this.maps = {
        left: { [attr]: `${this.computedSplitBound()}px` },
        right: {
          [attr]: `${this.getContainerLength() - this.computedSplitBound()}px`,
        },
      };
    }
  }

  getContainerLength() {
    return this.vertical
      ? this.splitterContainer?.offsetHeight
      : this.splitterContainer?.offsetWidth;
  }

  computedSplitBound() {
    const total = this.getContainerLength();
    const min = convertToNumber(this.min, total);
    const max = convertToNumber(this.max, total);
    const split = convertToNumber(this.split, total);
    return split < min
      ? split < min / 2 && this.closable
        ? 0
        : min
      : split > max
      ? max
      : split;
  }

  dragStart = (e: MouseEvent) => {
    this.isDrag = true;
    this.startPosition = this.vertical ? e.pageY : e.pageX;
    this.startSplit = this.computedSplitBound();
    this.splitterContainer.style.userSelect = 'none';
    this.splitterContainer.style.cursor = this.vertical
      ? 'row-resize'
      : 'col-resize';
    this.showMask = true;
  };

  dragMove = (e: MouseEvent) => {
    if (this.isDrag) {
      const position = this.vertical ? e.pageY : e.pageX;
      const dp = position - this.startPosition;
      this.split = String(this.startSplit + dp);
    }
  };

  dragEnd = () => {
    this.isDrag = false;
    this.splitterContainer.style.userSelect = 'initial';
    this.splitterContainer.style.cursor = 'initial';
    this.showMask = false;
  };

  render() {
    const leftStyle = styleMap(this.maps.left);

    const rightStyle = styleMap(this.maps.right);

    return html`
      <div
        class="code-sandbox-splitter"
        id="code-sandbox-splitter"
        @mousemove=${this.dragMove}
        @mouseup=${this.dragEnd}
        @mouseleave=${this.dragEnd}
      >
        <div class="code-sandbox-splitter-left" style=${leftStyle}>
          <slot name="code-sandbox-splitter-left"></slot>
          <div class="dragger" @mousedown=${this.dragStart}></div>
          <div
            class="split-mask ${this.showMask ? '' : 'split-mask-hidden'}"
          ></div>
        </div>
        <div class="code-sandbox-splitter-right" style=${rightStyle}>
          <slot name="code-sandbox-splitter-right"></slot>
          <div
            class="split-mask ${this.showMask ? '' : 'split-mask-hidden'}"
          ></div>
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
    'code-sandbox-splitter': CodeSandboxSplitter;
  }
}
