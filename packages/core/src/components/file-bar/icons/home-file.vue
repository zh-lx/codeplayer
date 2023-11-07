<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { TooltipText } from '@/constant';
import { store } from '@/store';
import { dialog } from '@/utils';

const props = defineProps<{ filename: string }>();

const resetHomeFile = (e: Event) => {
  if (store.entry === props.filename) {
    return;
  }
  e.stopPropagation();
  dialog({
    title: '提示',
    content: `确定要将 ${props.filename} 设置为入口文件吗?`,
    confirm: () => (store.entry = props.filename),
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
        content:
          store.entry === props.filename
            ? TooltipText.isEntry
            : TooltipText.SetEntry,
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
  <div ref="reference" class="operate-btn home-operate" @click="resetHomeFile">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="16px"
      width="16px"
      class="file-option-button"
      :class="{ 'current-home-operate': store.entry === props.filename }"
    >
      <path
        fill="currentColor"
        d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19zm2-4h8v2H8v-2z"
      />
    </svg>
  </div>
</template>
