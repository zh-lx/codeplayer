<script setup lang="ts">
import { ref, Ref, onMounted, watch, nextTick } from 'vue';
import { store } from '@/store';
import { EditorView } from 'codemirror';

import { createCodeMirror } from './code-mirror';
import { adaptExtensionsByFile, getFilenameExt } from '@/utils';

const codeEditorDOM = ref() as Ref<HTMLDivElement>;
let editor: EditorView;

onMounted(() => {
  createEditor();
  adaptExtensionsByFile(store.editor as EditorView, store.activeFile.filename);
});

const createEditor = () => {
  store.editor = editor = createCodeMirror(codeEditorDOM.value, {
    activeFile: store.activeFile,
  });
};

watch(
  () => store.activeFile,
  (file, oldFile) => {
    if (!file || !editor) {
      return;
    }
    const { code, filename } = file;
    const currentCode = store.editor?.state.doc.toString();
    if (code !== currentCode) {
      store.editor?.dispatch({
        changes: { from: 0, to: store.editor?.state.doc.length, insert: code },
      });
    }
    if (getFilenameExt(filename) !== getFilenameExt(oldFile.filename)) {
      adaptExtensionsByFile(store.editor as EditorView, filename);
    }
  }
);
</script>

<template>
  <div class="code-mirror-container" ref="codeEditorDOM"></div>
</template>
