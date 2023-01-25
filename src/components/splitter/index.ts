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
  @property()
  showLeft = true;
  @property()
  showRight = true;

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
  leftStyle = {};
  @state()
  rightStyle = {};

  @query('#code-sandbox-splitter')
  splitterRef: HTMLDivElement;
  @query('#dragger')
  draggerRef: HTMLDivElement;

  firstUpdated() {
    this.split = this.initialSplit;
  }

  protected willUpdate(
    changes: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (
      (changes.has('split') ||
        changes.has('showLeft') ||
        changes.has('showRight')) &&
      this.hasUpdated
    ) {
      const attr = this.vertical ? 'height' : 'width';
      this.leftStyle = {
        [attr]: `${this.computedSplitBound()}px`,
        'border-right':
          this.computedSplitBound() && this.showRight
            ? '1px solid var(--border-common-color)'
            : 'none',
        display: this.showLeft ? 'block' : 'none',
      };
      this.rightStyle = {
        display: this.showRight ? 'block' : 'none',
      };
    }
  }

  getContainerLength() {
    return this.vertical
      ? this.splitterRef?.offsetHeight
      : this.splitterRef?.offsetWidth;
  }

  computedSplitBound() {
    const total = this.getContainerLength();
    const min = convertToNumber(this.min, total);
    const max = convertToNumber(this.max, total);
    const split = convertToNumber(this.split, total);
    if (!this.showRight) {
      return total;
    }
    return split < min
      ? // split < min / 2 && this.closable ? 0:
        min
      : split > max
      ? max
      : split;
  }

  dragStart = (e: MouseEvent) => {
    this.isDrag = true;
    this.startPosition = this.vertical ? e.pageY : e.pageX;
    this.startSplit = this.computedSplitBound();
    this.splitterRef.style.userSelect = 'none';
    this.splitterRef.style.cursor = this.vertical ? 'row-resize' : 'col-resize';
    this.draggerRef.style.backgroundColor =
      'var(--border-brand-secondary-color)';
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
    this.splitterRef.style.userSelect = 'initial';
    this.splitterRef.style.cursor = 'initial';
    this.draggerRef.style.backgroundColor = 'transparent';
    this.showMask = false;
  };

  render() {
    return html`
      <div
        class="code-sandbox-splitter"
        id="code-sandbox-splitter"
        @mousemove=${this.dragMove}
        @mouseup=${this.dragEnd}
        @mouseleave=${this.dragEnd}
      >
        <div
          class="code-sandbox-splitter-left"
          style=${styleMap(this.leftStyle)}
        >
          <slot name="code-sandbox-splitter-left"></slot>
          <div id="dragger" class="dragger" @mousedown=${this.dragStart}></div>
          <div
            class="split-mask ${this.showMask ? '' : 'split-mask-hidden'}"
          ></div>
        </div>
        <div
          class="code-sandbox-splitter-right"
          style=${styleMap(this.rightStyle)}
        >
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
