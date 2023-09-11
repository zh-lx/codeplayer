# CodePlayer

CodePlayer 是一个轻量级的在线 WebIDE(Playground)，支持在线编写并运行 `html/js/css/ts/vue/react/less/scss` 等语法。实现了基于 esm 和 import-map 的纯浏览器构建，运行速度远超 `Stackblitz/CodeSandbox/CodePen` 等同类产品。

<p>
  <a href="https://sandbox-docs.fe-dev.cn">在线文档</a> | 
  <a href="https://sandbox.fe-dev.cn">在线体验</a>
</p>

[![NPM version](https://img.shields.io/npm/v/codeplayer.svg)](https://www.npmjs.com/package/codeplayer)
[![GITHUB star](https://img.shields.io/github/stars/zh-lx/codeplayer.svg)](https://github.com/zh-lx/codeplayer)
[![MIT-license](https://img.shields.io/npm/l/code-inspector.svg)](https://opensource.org/licenses/MIT)
[![GITHUB-language](https://img.shields.io/github/languages/top/zh-lx/codeplayer.svg)](https://github.com/zh-lx/codeplayer)

![image](https://github.com/zh-lx/codeplayer/assets/73059627/e2df9937-3e36-433d-ad8d-89e19ed72eb8)

## Feature

- 极致的编译和构建速度
- 内置 `Vue3 / React / Typescript / Javascript / HTML / CSS / Less / Sass` 等多种代码解析器
- 支持通过 importMap 导入第三方库
- 代码实时编码压缩同步至 url 以便于分享

## Install

浏览器 `script` 引入:

```html
<script src="https://unpkg.com/codeplayer"></script>
```

使用 `npm` 或者 `yarn` 安装:

```perl
npm install codeplayer
# or
yarn add codeplayer
```

## Example

浏览器 script 使用：

```html
<script src="https://unpkg.com/codeplayer"></script>
<script>
  new CodePlayer('#container', {
    appType: 'react',
  });
</script>
```

ES6 使用:

```ts
import CodePlayer from 'codeplayer';

new CodePlayer('#container', {
  appType: 'react',
});
```
