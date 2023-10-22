<template>
  <CodePlayer :options="options" class="codeplayer-container"></CodePlayer>
</template>

<script setup lang="ts">
import CodePlayer from './components/index.vue';
import { CodePlayerOptions } from './type';

const options: CodePlayerOptions = {
  appType: 'vue3',
  showFileBar: true,
  showCode: true,
  showPreview: true,
  mainFile: '',
  initFiles: undefined,
};
</script>

<style scoped lang="less">
.codeplayer-container {
  max-height: 100vh;
  height: 100vh;
  border: none;
}
</style>
