# 组件式使用

codeplayer 本身是一个 vue3 组件，因此支持在 vue3 项目中以组件的方式使用，以便于进入进行私有化部署。

## 安装

选择一个你喜欢的包管理器进行安装:

```sh
npm i codeplayer
# or
yarn add codeplayer
# or
pnpm add codeplayer
```

## 使用

如下代码是一个引入 `codeplayer` 并使用的示例：

::: code-group

```html [App.vue]
<template>
  <CodePlayer :options="options" class="codeplayer-container"></CodePlayer>
</template>

<script setup lang="ts">
  import CodePlayer, { CodePlayerOptions } from 'codeplayer';

  const options: CodePlayerOptions = {
    appType: 'vue3',
  };
</script>

<style scoped>
  .codeplayer-container {
    max-height: 100vh;
    height: 100vh;
  }
</style>
```

```ts [main.ts]
import { createApp } from 'vue';
import 'codeplayer/dist/style.css';

import App from './App.vue';

const app = createApp(App);
app.mount('#app');
```

:::

## 配置

可以通过 `options` 参数对 `codeplayer` 进行配置，`options` 参数的属性同[指南-配置](/guide/config) 一节。
