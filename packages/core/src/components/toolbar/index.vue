<script setup lang="ts">
import SettingIcon from './icons/setting.vue';
import RefreshIcon from './icons/refresh.vue';
import ShareIcon from './icons/share.vue';
</script>

<template>
  <div class="code-player-toolbar" :class="`code-player-toolbar-top`">
    <div class="toolbar-left">
      <SettingIcon />
    </div>
    <div class="toolbar-right">
      <RefreshIcon />
      <ShareIcon />
    </div>
  </div>
</template>

<style scoped lang="less">
.code-player-toolbar {
  height: 36px;
  box-sizing: border-box;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  order: 1;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--toolbar-bgc);
  .toolbar-left {
    display: flex;
    align-items: center;
  }
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: @gap-1;
  }
}
</style>
