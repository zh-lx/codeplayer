<template>
  <CodePlayer :options="options" class="codeplayer-container"></CodePlayer>
</template>

<script setup lang="ts">
import CodePlayer from '../../core';

const options = {
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
