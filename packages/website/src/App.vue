<template>
  <CodePlayer :options="options" class="codeplayer-container"></CodePlayer>
</template>

<script setup lang="ts">
import CodePlayer, { CodePlayerOptions } from '../../core/src/index';
// import CodePlayer, { CodePlayerOptions } from '../../core';

const options: CodePlayerOptions = {
  appType: 'vue3',
  showFileBar: true,
  showCode: true,
  showPreview: true,
};
</script>

<style scoped lang="less">
.codeplayer-container {
  max-height: 100vh;
  height: 100vh;
}
</style>
