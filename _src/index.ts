import { LitElement, css, html, PropertyValues, PropertyValueMap } from 'lit';
import {
  customElement,
  property,
  query,
  state,
  queryAsync,
} from 'lit/decorators.js';
import { Editor } from 'codemirror';
import { style } from './style';
import { createCodeMirror } from './components/codemirror';
import './components/editor';
import './components/iframe';
import { ReplStore, StoreOptions } from './utils';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('code-sandbox')
export class CodeSandbox extends LitElement {
  constructor() {
    super();
  }

  @property()
  height = 200;

  @property()
  options: StoreOptions = {};

  @state()
  store = new ReplStore(this.options);

  protected willUpdate(_changedProperties: PropertyValueMap<this>) {
    if (_changedProperties.has('options')) {
      this.store = new ReplStore(this.options);
    }
  }

  render() {
    return html`
      <div class="code-sandbox" style="height: ${this.height}px;">
        <div class="split-left">
          <div class="code-editor-container">
            <div id="__file-selector"></div>
            <code-editor .store=${this.store}></code-editor>
          </div>
          <div class="code-sandbox-dragger" id="__dragger"></div>
        </div>
        <div class="split-right">
          <iframe-sandbox .store=${this.store}></iframe-sandbox>
        </div>
      </div>
    `;
  }

  static styles = style;
}

declare global {
  interface HTMLElementTagNameMap {
    'code-sandbox': CodeSandbox;
  }
}
