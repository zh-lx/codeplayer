import CodeMirror from 'codemirror';
import { File } from '@/utils';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
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
    activeFile: File;
}
export declare const createCodeMirror: (el: HTMLElement, { readonly, activeFile }: CodeMirrorOptions) => CodeMirror.Editor;
export {};
