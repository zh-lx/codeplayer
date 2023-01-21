import { LitElement, html, PropertyValueMap, unsafeCSS, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Editor } from 'codemirror';
import { createCodeMirror } from '@/components/codemirror';
import { getMode, File } from '@/utils';
import style from './style.less?inline';

@customElement('code-editor')
export class CodeSandbox extends LitElement {
  editor: Editor;

  @property()
  activeFile: File;

  @query('#code-mirror-container')
  _codeEditor: HTMLDivElement;

  firstUpdated() {
    this.createEditor();
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.updateActive();
  }

  updateActive() {
    if (!this.activeFile) {
      return;
    }
    const { code, filename } = this.activeFile;
    if (this.editor && this.editor.getValue() !== code) {
      this.editor.setValue(code);
      this.editor.setOption('mode', getMode(filename));
    }
  }

  createEditor() {
    this.editor = createCodeMirror(this._codeEditor, {
      activeFile: this.activeFile,
    });
    this.editor.on('change', (instance) => {
      this.dispatchEvent(
        new CustomEvent('emitMethod', {
          detail: ['setCode', instance.getValue()],
        })
      );
    });
  }

  render() {
    return html`
      <div class="code-mirror-container" id="code-mirror-container"></div>
    `;
  }

  static styles = css`
    ${unsafeCSS(style)}
  `;
}
