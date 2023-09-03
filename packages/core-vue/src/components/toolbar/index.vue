<script setup lang="ts">
import { fileStore, store } from '@/store';
import CodeIcon from './icons/code.vue';
import SettingIcon from './icons/setting.vue';
import CopyIcon from './icons/copy.vue';
import FileIcon from './icons/files.vue';
import PreviewIcon from './icons/preview.vue';
import ReverseIcon from './icons/reverse.vue';
import RefreshIcon from './icons/refresh.vue';
import ShareIcon from './icons/share.vue';
</script>

<template>
  <div
    class="code-player-toolbar"
    :class="`code-player-toolbar-${
      store.toolbarPosition === 'bottom' ? 'bottom' : 'top'
    }`"
  >
    <div class="toolbar-left">
      <SettingIcon />
    </div>
    <div class="toolbar-right">
      <FileIcon />
      <CodeIcon />
      <PreviewIcon />
      <ReverseIcon />
      <CopyIcon />
      <RefreshIcon />
      <ShareIcon />
    </div>
  </div>
</template>
