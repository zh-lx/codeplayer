<script setup lang="ts">
import { ref, Ref, onMounted, watch, nextTick } from 'vue';
import { store } from '@/store';
import { type Editor } from 'codemirror';
import { createCodeMirror } from './code-mirror';
import { getMode } from '@/utils';

const codeEditorDOM = ref() as Ref<HTMLDivElement>;
let editor: Editor;

onMounted(() => {
  createEditor();
});

const createEditor = () => {
  store.editor = editor = createCodeMirror(codeEditorDOM.value, {
    activeFile: store.activeFile,
  });
  editor.on('change', () => {
    store.activeFile.code = (editor as Editor).getValue();
  });
};

watch(
  () => store.activeFile,
  (file) => {
    if (!file || !editor) {
      return;
    }
    const { code, filename } = file;
    if (code !== editor?.getValue()) {
      editor?.setValue(code);
      nextTick(() => {
        editor.refresh();
      });
    }
    if (getMode(filename) !== editor?.getOption('mode')) {
      editor?.setOption('mode', getMode(filename));
      nextTick(() => {
        editor.refresh();
      });
    }
  }
);
</script>

<template>
  <div class="code-mirror-container" ref="codeEditorDOM"></div>
</template>
