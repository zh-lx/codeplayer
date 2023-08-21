<script setup lang="ts">
import { ref, Ref, onMounted, watch, nextTick, computed } from 'vue';
import { Editor } from 'codemirror';
import { fileStore, store } from '@/store';
import { createCodeMirror } from './code-mirror';
import { getFileExtraName } from '@/utils';
import { getMode } from './mode';

const codeEditorDOM = ref() as Ref<HTMLDivElement>;
let editor: Editor;

onMounted(() => {
  createEditor();
});

const createEditor = () => {
  store.editor = editor = createCodeMirror(codeEditorDOM.value, {
    activeFile: fileStore.activeFile,
  });

  editor.on('change', () => {
    fileStore.activeFile.code = editor.getValue();
  });
};

const styleStr = computed(
  () => `
.CodeMirror-line {
  font-size: ${store.codeSize}px !important;
}
.CodeMirror-line,
.CodeMirror-foldgutter-open,
.CodeMirror-foldgutter-folded,
.CodeMirror-linenumber {
  line-height: ${store.codeSize + 4}px !important;
}`
);

watch(
  () => fileStore.activeFile,
  (file, oldFile) => {
    if (!file || !editor) {
      return;
    }
    const { code, filename } = file;
    if (code !== editor.getValue()) {
      editor.setValue(code);
      nextTick(() => editor.refresh());
    }
    const newType = getFileExtraName(filename);
    if (newType !== getFileExtraName(oldFile?.filename || '')) {
      editor.setOption('mode', getMode(filename));
      nextTick(() => editor.refresh());
    }
  }
);
</script>

<template>
  <component is="style">{{ styleStr }}</component>
  <div class="code-mirror-container" ref="codeEditorDOM"></div>
</template>
