<script lang="ts" setup>
import { store } from '@/store';
import { TooltipText } from '@/constant';

function reverse() {
  store.reverse = !store.reverse;
  store.reverseID++;
}
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('reverse')"
    data-toggle="tooltip"
    :title="TooltipText.SwapLayout"
    @click="reverse"
    class="toolbar-icon"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path
        fill="currentColor"
        d="M4 5v14h16V5H4zM3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm12 4l3.5 3-3.5 3v-2h-4V9h4V7zM9 17l-3.5-3L9 11v2h4v2H9v2z"
      />
    </svg>
  </div>
</template>
