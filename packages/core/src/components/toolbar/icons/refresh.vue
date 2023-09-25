<script lang="ts" setup>
import { store } from '@/store';
import { onMounted, ref, watch } from 'vue';
import tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { TooltipText } from '@/constant';

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
        content: TooltipText.RefreshWebPreview,
        placement: 'bottom',
        arrow: false,
        theme: store.theme === 'dark' ? '' : 'light',
      }) as unknown as Instance<Props>;
    },
    { immediate: true }
  );
});

function refresh() {
  store.rerenderID++;
}
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('refresh')"
    ref="reference"
    @click="refresh"
    class="toolbar-icon"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <path
        fill="currentColor"
        d="M18.537 19.567A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3a8 8 0 1 0-2.46 5.772l.997 1.795z"
      />
    </svg>
  </div>
</template>
<style scoped lang="less">
@import './icon.less';
</style>
