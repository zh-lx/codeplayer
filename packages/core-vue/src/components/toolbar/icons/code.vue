<script lang="ts" setup>
import { store } from '@/store';
import { TooltipText } from '@/constant';
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('code')"
    data-toggle="tooltip"
    :title="TooltipText.ToggleCode(store.showCode)"
    @click="() => (store.showCode = !store.showCode)"
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
        d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm16 7l-3.536 3.536-1.414-1.415L17.172 12 15.05 9.879l1.414-1.415L20 12zM6.828 12l2.122 2.121-1.414 1.415L4 12l3.536-3.536L8.95 9.88 6.828 12zm4.416 5H9.116l3.64-10h2.128l-3.64 10z"
      />
    </svg>
  </div>
</template>
