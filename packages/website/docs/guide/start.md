# 快速开始

## 总览

CodeSandbox 是一个浏览器环境的组件，同时具备【代码编辑器】和【浏览器实时运行预览】特性，可以在浏览器环境直接解析 `react/vue/ts` 等前端代码而无需打包器。

## 浏览器支持

CodeSandbox 由于是基于 web component 编写，所以使用上无框架层面的限制，可以在任何支持 web component api 的浏览器上运行，浏览器兼容性如下表：

| [![edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_24x24.png)](http://godban.github.io/browsers-support-badges/)<br/> Edge | [![firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_24x24.png)](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [![chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_24x24.png)](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [![safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_24x24.png)](http://godban.github.io/browsers-support-badges/)<br/>Safari | [![opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_24x24.png)](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| >=79                                                                                                                                                        | >=63                                                                                                                                                                   | >=54                                                                                                                                                               | >=10.1                                                                                                                                                             | >=41                                                                                                                                                           |

## 安装

支持使用包管理器安装或者浏览器直接引入。

### 使用包管理器

推荐使用包管理器进行安装：

```shell
# 选择一个你喜欢的包管理器

# NPM
$ npm install @code-sandbox/core --save

# Yarn
$ yarn add @code-sandbox/core

# pnpm
$ pnpm install @code-sandbox/core
```

### 浏览器直接引入

可以通过浏览器的 `script` 标签导入 CDN 文件使用，下面以 [unpkg](https://unpkg.com) 和 [jsDelivr](https://jsdelivr.com) CDN 厂商为例：

#### unpkg

```html
<!-- 引入固定版本 -->
<head>
  <script src="https://unpkg.com/@code-sandbox/core@0.0.1/dist/index.umd.js"></script>
</head>

<!-- 自动引入最新版本 -->
<head>
  <script src="https://unpkg.com/@code-sandbox/core"></script>
</head>
```

#### jsDelivr

```html
<!-- 引入固定版本 -->
<head>
  <script src="https://unpkg.com/@code-sandbox/core@0.0.1/dist/index.umd.js"></script>
</head>

<!-- 自动引入最新版本 -->
<head>
  <script src="https://unpkg.com/@code-sandbox/core"></script>
</head>
```

::: tip
我们建议使用 CDN 引入 CodeSandbox 的用户在链接地址上锁定版本，以固定版本的方式引入，以免将来 CodeSandbox 升级时受到非兼容性更新的影响。
:::

## 使用

支持多种环境及模块化规范的使用方式。

### 浏览器 ES6

```js
import CodeSandbox from '@code-sandbox/core';

new CodeSandbox('#container', {
  appType: 'vue',
});
```

### 浏览器 esm 动态导入

```js
import('@code-sandbox/core').then((CodeSandbox) => {
  new CodeSandbox('#container', {
    appType: 'vue',
  });
});
```

### 浏览器直接引入

以 CDN 方式浏览器直接引入后，会在 window 全局挂载一个 `CodeSandbox` 对象。

```html
<script src="https://unpkg.com/@code-sandbox/core"></script>

<script>
  new CodeSandbox('#container', {
    appType: 'vue',
  });
</script>
```
