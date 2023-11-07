<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { TooltipText } from '@/constant';
import { store } from '@/store';
import { message, dialog } from '@/utils';

const props = defineProps<{ filename: string }>();

// 删除文件
const deleteFile = (e: Event) => {
  if (props.filename === store.entry) {
    message('不能删除入口文件', { type: 'danger' });
  }
  e.stopPropagation();
  dialog({
    title: '提示',
    content: `确定要删除 ${props.filename} 吗?`,
    confirm: () => {
      if (store.activeFile === props.filename) {
        store.activeFile = store.entry;
      }
      const tempFiles = { ...store.files };
      delete tempFiles[props.filename];
      store.files = tempFiles;
    },
  });
};

const reference = ref();
let tippyDOM: Instance<Props> | undefined;

onMounted(() => {
  watch(
    () => store.theme,
    () => {
      if (tippyDOM) {
        tippyDOM.destroy();
      }
      tippyDOM = tippy(reference.value, {
        content: TooltipText.DeleteFile,
        placement: 'bottom',
        arrow: false,
        theme: store.theme === 'dark' ? '' : 'light',
      }) as unknown as Instance<Props>;
    },
    { immediate: true }
  );
});
</script>
<template>
  <div
    class="operate-btn delete-operate"
    :class="{ 'hide-file-operate': store.entry === props.filename }"
    @click="deleteFile"
    ref="reference"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="16px"
      width="16px"
      class="file-option-button"
    >
      <path
        fill="currentColor"
        d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
      />
    </svg>
  </div>
</template>
