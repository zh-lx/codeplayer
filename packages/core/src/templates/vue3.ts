import { MapFile } from '@/constant';

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodePlayer</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
  <script type="module">
    import './main.ts';
  </script>
</html>
`.trim();

const mainTs = `
import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
`.trim();

const appVue = `
<template>
  <div class="container">
    <a-space>
      <a-button type="primary">Primary</a-button>
      <a-button>Secondary</a-button>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="outline">Outline</a-button>
      <a-button type="text">Text</a-button>
    </a-space>
  </div>
</template>

<style lang="less">
.container {
  padding: 16px;
}
</style>
`.trim();

const importMap = `
{
  "imports": {
    "vue": "https://esm.sh/vue@3.3.8",
    "@arco-design/web-vue": "https://esm.sh/@arco-design/web-vue@2.53.1",
    "@arco-design/web-vue/": "https://esm.sh/@arco-design/web-vue@2.53.1/"
  }
}
`.trim();

export const Vue3Template = {
  'index.html': indexHtml,
  'main.ts': mainTs,
  'App.vue': appVue,
  [MapFile]: importMap,
};
