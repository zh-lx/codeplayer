import { MapFile } from './index';

export const Vue2Template = {
  'index.html': `<!DOCTYPE html>
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
</html>`,
  'main.ts': `import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});
  `.trim(),
  'App.vue': `<template>
  <div>
    <el-row>
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </el-row>

    <el-row>
      <el-button plain>Plain</el-button>
      <el-button type="primary" plain>Primary</el-button>
      <el-button type="success" plain>Success</el-button>
      <el-button type="info" plain>Info</el-button>
      <el-button type="warning" plain>Warning</el-button>
      <el-button type="danger" plain>Danger</el-button>
    </el-row>

    <el-row>
      <el-button round>Round</el-button>
      <el-button type="primary" round>Primary</el-button>
      <el-button type="success" round>Success</el-button>
      <el-button type="info" round>Info</el-button>
      <el-button type="warning" round>Warning</el-button>
      <el-button type="danger" round>Danger</el-button>
    </el-row>

    <el-row>
      <el-button icon="el-icon-search" circle></el-button>
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
      <el-button type="success" icon="el-icon-check" circle></el-button>
      <el-button type="info" icon="el-icon-message" circle></el-button>
      <el-button type="warning" icon="el-icon-star-off" circle></el-button>
      <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  //
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
`.trim(),
  [MapFile]: `
{
  "imports": {
    "vue": "https://esm.sh/vue@2.7.15",
    "element-ui": "https://esm.sh/element-ui@2.5.0",
    "element-ui/": "https://esm.sh/element-ui@2.5.0/"
  }
}`.trim(),
};

export const Vue3Template = {
  'index.html': `<!DOCTYPE html>
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
</html>`,
  'main.ts': `import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.mount('#app');
  `.trim(),
  'App.vue': `<template>
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>

  <el-row class="mb-4">
    <el-button plain>Plain</el-button>
    <el-button type="primary" plain>Primary</el-button>
    <el-button type="success" plain>Success</el-button>
    <el-button type="info" plain>Info</el-button>
    <el-button type="warning" plain>Warning</el-button>
    <el-button type="danger" plain>Danger</el-button>
  </el-row>

  <el-row class="mb-4">
    <el-button round>Round</el-button>
    <el-button type="primary" round>Primary</el-button>
    <el-button type="success" round>Success</el-button>
    <el-button type="info" round>Info</el-button>
    <el-button type="warning" round>Warning</el-button>
    <el-button type="danger" round>Danger</el-button>
  </el-row>

  <el-row>
    <el-button :icon="Search" circle />
    <el-button type="primary" :icon="Edit" circle />
    <el-button type="success" :icon="Check" circle />
    <el-button type="info" :icon="Message" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
  </el-row>
</template>

<script lang="ts" setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
`.trim(),
  [MapFile]: `
{
  "imports": {
    "vue": "https://esm.sh/vue@3.3.4",
    "element-plus": "https://esm.sh/element-plus@2.3.12",
    "element-plus/": "https://esm.sh/element-plus@2.3.12/",
    "@element-plus/": "https://esm.sh/@element-plus/"
  }
}`.trim(),
};

export const ReactTemplate = {
  'index.html': `<!DOCTYPE html>
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
    import './main.tsx';
  </script>
</html>`,
  'main.tsx': `import React from "react";
import { createRoot } from "react-dom/client";
import App from './App.tsx';

const root = createRoot(document.getElementById('app'));
root.render(<App />)
`.trim(),
  'App.tsx': `import React from 'react';
import { Button, Space } from 'antd';

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </Space>
);

export default App;
`.trim(),
  [MapFile]: `{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/": "https://esm.sh/react-dom@18.2.0/",
    "antd": "https://esm.sh/antd@5.8.5",
    "@antd/": "https://esm.sh/@antd@5.8.5/"
  }
}`.trim(),
};

export const HtmlTemplate = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code player</title>
    <link href="//unpkg.com/layui@2.8.16/dist/css/layui.css" rel="stylesheet">
  </head>
  <body>
    <div class="layui-btn-container">
      <button type="button" class="layui-btn">默认按钮</button>
      <button type="button" class="layui-btn layui-bg-blue">蓝色按钮</button>
      <button type="button" class="layui-btn layui-bg-orange">橙色按钮</button>
      <button type="button" class="layui-btn layui-bg-red">红色按钮</button>
      <button type="button" class="layui-btn layui-bg-purple">紫色按钮</button>
      <button type="button" class="layui-btn layui-btn-disabled">禁用按钮</button>
    </div>
    
    <div class="layui-btn-container">
      <button class="layui-btn layui-btn-primary layui-border-green">主色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-blue">蓝色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-orange">橙色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-red">红色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-purple">紫色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border">普通按钮</button>
    </div>
  </body>
</html>
  `.trim(),
  [MapFile]: `
{
  "imports": {
    "layui": "https://esm.sh/layui@2.8.16",
    "layui/": "https://esm.sh/layui@2.8.16/"
  }
}
  `.trim(),
};

export const JavascriptTemplate = {
  'index.html': `<!DOCTYPE html>
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
    import './index.js';
  </script>
</html>`,
  'index.js': `import layui from "layui";
import "layui/dist/css/layui.css";

layer.open({
  type: 1, // page 层类型
  area: ['500px', '300px'],
  title: 'Hello layer',
  shade: 0.6, // 遮罩透明度
  shadeClose: true, // 点击遮罩区域，关闭弹层
  maxmin: true, // 允许全屏最小化
  anim: 0, // 0-6 的动画形式，-1 不开启
  content: '<div style="padding: 32px;">一个普通的页面层，传入了自定义的 HTML</div>'
});
`.trim(),
  [MapFile]: `
{
  "imports": {
    "layui": "https://esm.sh/layui@2.8.16",
    "layui/": "https://esm.sh/layui@2.8.16/"
  }
}
`.trim(),
};

export const TypescriptTemplate = {
  'index.html': `<!DOCTYPE html>
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
    import './index.ts';
  </script>
</html>`,
  'index.ts': `import layui from "layui";
import "layui/dist/css/layui.css";

const layer = layui.layer || window.layer;
layer.open({
  type: 1, // page 层类型
  area: ['500px', '300px'],
  title: 'Hello layer',
  shade: 0.6, // 遮罩透明度
  shadeClose: true, // 点击遮罩区域，关闭弹层
  maxmin: true, // 允许全屏最小化
  anim: 0, // 0-6 的动画形式，-1 不开启
  content: '<div style="padding: 32px;">一个普通的页面层，传入了自定义的 HTML</div>'
});
`.trim(),
  [MapFile]: `
{
  "imports": {
    "layui": "https://esm.sh/layui@2.8.16",
    "layui/": "https://esm.sh/layui@2.8.16/"
  }
}
`.trim(),
};
