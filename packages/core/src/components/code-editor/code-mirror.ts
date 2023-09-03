import CodeMirror from 'codemirror';
import { getMode } from './mode';
import { fileStore } from '@/store'

// mode
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/vue/vue.js';
import 'codemirror/mode/jsx/jsx.js';
// addon
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
  activeFile: string;
}

export const createCodeMirror = (
  el: HTMLElement,
  { readonly, activeFile }: CodeMirrorOptions
) => {
  const addonOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  };

  const editor = CodeMirror(el, {
    value: fileStore.files[activeFile]?.code || '',
    tabSize: 2,
    // lineWrapping: true,
    lineNumbers: true,
    readOnly: readonly,
    mode: getMode(fileStore.files[activeFile]?.filename || ''),
    ...addonOptions,
  });

  return editor;
};
