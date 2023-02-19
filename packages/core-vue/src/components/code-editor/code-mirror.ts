import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { File } from '@/utils';

interface CodeMirrorOptions {
  mode?: string;
  readonly?: boolean;
  activeFile: File;
}

export const createCodeMirror = (
  el: HTMLElement,
  { readonly, activeFile }: CodeMirrorOptions
) => {
  let startState = EditorState.create({
    doc: activeFile.code || '',
  });

  let editor = new EditorView({
    state: startState,
    parent: el,
  });

  return editor;
};
