<template>
  <CodePlayer :options="options" class="codeplayer-container"></CodePlayer>
</template>

<script setup lang="ts">
import CodePlayer, { CodePlayerOptions } from 'codeplayer';

const options: CodePlayerOptions = {
  appType: 'react',
};
</script>

<style scoped lang="less">
.codeplayer-container {
  max-height: 100vh;
  height: 100vh;
}
</style>
