<script setup lang="ts">
import { ref, Ref, onMounted, watch } from 'vue';
import { store } from '@/store';
import { modulesKey, exportKey, dynamicImportKey, MapFile } from '@/constant';
import { Compiler } from '@/compiler';

interface IframeWindow extends Window {
  process: Record<string, any>;
  [modulesKey]: Record<string, any>;
  [exportKey]: Function;
  [dynamicImportKey]: Function;
  __next__: Function;
}

const errors = ref<string[]>([]);
const previewDOM = ref() as Ref<HTMLDivElement>;
const iframe = ref<HTMLIFrameElement>();

const compiler = new Compiler();

onMounted(() => {
  renderSandbox();
});

watch(
  () => store.files,
  (newVal, oldVal) => {
    if (newVal?.[MapFile]?.code !== oldVal?.[MapFile]?.code) {
      renderSandbox();
    } else {
      refreshSandbox();
    }
  },
  {
    deep: true,
  }
);

watch(() => store.mainFile, refreshSandbox);

watch(() => store.rerenderID, renderSandbox);

async function renderSandbox() {
  if (!previewDOM.value) {
    return;
  }
  // 建立一个新的 iframe
  iframe.value?.remove();
  iframe.value = document.createElement('iframe');
  iframe.value.className = 'code-player-iframe';
  previewDOM.value.append(iframe.value);

  const result = { errors: [] };
  await compiler.run({
    fileMap: store.files,
    result,
    entry: store.mainFile,
    iframe: iframe.value as HTMLIFrameElement,
    render: true,
  });
  errors.value = result.errors;
}

async function refreshSandbox() {
  if (!previewDOM.value) {
    return;
  }
  // 建立一个新的 iframe
  const result = { errors: [] };
  await compiler.run({
    fileMap: store.files,
    result,
    entry: store.mainFile,
    iframe: iframe.value as HTMLIFrameElement,
    render: false,
  });
  errors.value = result.errors;
}
</script>

<template>
  <div class="code-player-iframe-container" ref="previewDOM"></div>
</template>
