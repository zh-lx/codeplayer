<script lang="ts" setup>
import { fileStore, store } from '@/store';
import { TooltipText } from '@/constant';
import { utoa } from '@/utils';

function share() {
  // Todo: share link
  const url = new URL(store.sharePath);
  const serializedState = getSerializedState();
  url.searchParams.set('_cs_code_', serializedState);
  window.open(url.href, '_blank');
}

const getSerializedState = () => {
  const _files: Record<string, string> = {};
  Object.keys(fileStore.files).forEach((filename) => {
    _files[filename] = fileStore.files[filename].code;
  });
  return utoa(JSON.stringify(_files));
};
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('share')"
    data-toggle="tooltip"
    :title="TooltipText.Share"
    @click="share"
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
        d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12l7-7z"
      />
    </svg>
  </div>
</template>
