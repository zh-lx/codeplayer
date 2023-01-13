import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Editor } from 'codemirror';
import { createCodeMirror } from '../codemirror';
import { ReplStore } from '../../utils';
import { style } from './style';

@customElement('code-editor')
export class CodeSandbox extends LitElement {
  editor: Editor;

  @property()
  store: ReplStore;

  @query('#code-mirror-container')
  _codeEditor: HTMLDivElement;

  updated() {
    this.createEditor();
  }

  createEditor() {
    this.editor = createCodeMirror(this._codeEditor, {
      store: this.store,
    });
  }

  render() {
    return html`
      <div class="code-mirror-container" id="code-mirror-container"></div>
    `;
  }

  static styles = style;
}
