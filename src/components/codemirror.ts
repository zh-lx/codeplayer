import CodeMirror from 'codemirror';
import './codemirror.css';
import { ReplStore } from '../core/store';
import { getMode } from '../utils';

// modes
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

// addons
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

interface CodeMirrorOptions {
  mode?: string;
  readonly?: boolean;
  store: ReplStore;
}

export const createCodeMirror = (
  el: HTMLElement,
  { readonly, store }: CodeMirrorOptions
) => {
  const editorContainer = document.createElement('div');
  el.append(editorContainer);

  const addonOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  };

  const editor = CodeMirror(editorContainer!, {
    value: store.state.activeFile.code || '',
    mode: getMode(store.state.activeFile.filename),
    readOnly: readonly,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    ...addonOptions,
  });

  // editor.on('change', () => {
  //   console.log(editor.getValue());
  // });

  return editor;
};
