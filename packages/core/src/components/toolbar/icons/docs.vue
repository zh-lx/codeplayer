<script lang="ts" setup>
import { store } from '@/store';
import { ref } from 'vue';
import { TooltipText } from '@/constant';
import { useTooltip } from '@/composables/use-tooltip';

const reference = ref();
useTooltip(reference, () => TooltipText.Docs);

function readDocs() {
  window.open(store.document, '_blank');
}
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('docs')"
    ref="reference"
    @click="readDocs"
    class="toolbar-icon"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-book-open-text"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      <path d="M6 8h2" />
      <path d="M6 12h2" />
      <path d="M16 8h2" />
      <path d="M16 12h2" />
    </svg>
  </div>
</template>
<style scoped lang="less">
@import './icon.less';
</style>
