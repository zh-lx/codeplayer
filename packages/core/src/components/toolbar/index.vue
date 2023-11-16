<script setup lang="ts">
import { computed } from 'vue';
import { store } from '@/store';
import SettingIcon from './icons/setting.vue';
import RefreshIcon from './icons/refresh.vue';
import ShareIcon from './icons/share.vue';
import DocsIcon from './icons/docs.vue';
import GithubIcon from './icons/git.vue';

const showDidiver = computed(() => {
  if (
    store.excludeTools.includes('docs') &&
    store.excludeTools.includes('github')
  ) {
    return false;
  }
  if (
    store.excludeTools.includes('refresh') &&
    store.excludeTools.includes('share')
  ) {
    return false;
  }
  return true;
});
</script>

<template>
  <div class="codeplayer-toolbar" :class="`codeplayer-toolbar-top`">
    <div class="toolbar-left">
      <SettingIcon />
    </div>
    <div class="toolbar-right">
      <DocsIcon />
      <GithubIcon />
      <div class="vertical-divider" v-if="showDidiver"></div>
      <RefreshIcon />
      <ShareIcon />
    </div>
  </div>
</template>

<style scoped lang="less">
.codeplayer-toolbar {
  height: 36px;
  min-height: 36px;
  box-sizing: border-box;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  order: 1;
  border-bottom: 1px solid var(--codeplayer-border-color);
  background-color: var(--codeplayer-toolbar-bgc);
  .toolbar-left {
    display: flex;
    align-items: center;
  }
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: @gap-1;
    .vertical-divider {
      width: 0;
      height: 15px;
      margin: 0 6px;
      border-right: 1px solid var(--codeplayer-tertiary-color);
    }
  }
}
</style>
