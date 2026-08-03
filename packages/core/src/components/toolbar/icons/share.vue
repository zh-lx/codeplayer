<script lang="ts" setup>
import { store } from '@/store';
import { ref } from 'vue';
import { TooltipText } from '@/constant';
import { message } from '@/utils';
import { useTooltip } from '@/composables/use-tooltip';

const reference = ref();
useTooltip(reference, () => TooltipText.Share);

function share() {
  navigator.clipboard.writeText(location.href);
  message(TooltipText.CopyLink, { type: 'success' });
}
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('share')"
    ref="reference"
    @click="share"
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
        d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12l7-7z"
      />
    </svg>
  </div>
</template>
<style scoped lang="less">
@import './icon.less';
</style>
