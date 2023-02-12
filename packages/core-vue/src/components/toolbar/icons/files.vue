<script lang="ts" setup>
import { store } from '@/store';
import { TooltipText } from '@/constant';
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('fileBar')"
    data-toggle="tooltip"
    :title="TooltipText.ToggleFiles(store.showFileBar)"
    @click="() => (store.showFileBar = !store.showFileBar)"
    class="toolbar-icon"
    :class="{ 'toolbar-disable-icon': !store.showFileBar }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path
        fill="currentColor"
        d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM7 5H4v14h3V5zm13 0H9v14h11V5z"
      />
    </svg>
  </div>
</template>
