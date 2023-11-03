import { Hookable } from 'hookable';
import * as monaco from 'monaco-editor';

export type Hooks = Hookable<Record<string, any>, string>;

export type Plugin = (hooks: Hooks) => void;

export interface ComplierPluginParams {
  fileMap: Record<string, File>;
  result: { errors: Error[] };
  entry: string;
  iframe: HTMLIFrameElement;
  render: boolean;
}

export interface ComplierPluginResult {
  modules: Array<string>;
  styles: Array<string>;
  links: Array<string>;
  html: Array<string>;
}

export class File {
  filename: string;
  code: string;
  compiled = {
    js: '',
    css: '',
  };
  editorViewState: monaco.editor.ICodeEditorViewState | null;

  constructor(filename: string, code = '') {
    this.filename = filename;
    this.code = code;
    this.editorViewState = null;
  }
}
