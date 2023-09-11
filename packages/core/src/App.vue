<template>
  <CodePlayer
    :options="options"
    :class="`codeplayer-container codeplayer-${store.theme}`"
  ></CodePlayer>
</template>

<script setup lang="ts">
import CodePlayer from './components/index.vue';
import { CodePlayerOptions } from './type';
import { store } from './store';

const options: CodePlayerOptions = {
  appType: 'vue3',
  // excludeTools: ['code', 'reverse', 'preview', 'fileBar'],
};
</script>

<style scoped lang="less">
.codeplayer-container {
  max-height: 100vh;
  height: 100vh;
  border: none;
}
</style>
