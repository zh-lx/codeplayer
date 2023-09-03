# CodePlayer

CodePlayer 是一个在线代码编辑及实时预览的 UI 组件，支持浏览器环境下编写 `html/js/css/ts/vue/react` 等类型的代码并在沙盒环境下实时运行预览。

[![NPM version](https://img.shields.io/npm/v/codeplayer.svg)](https://www.npmjs.com/package/codeplayer)
[![GITHUB star](https://img.shields.io/github/stars/zh-lx/codeplayer.svg)](https://github.com/zh-lx/codeplayer)
[![MIT-license](https://img.shields.io/npm/l/code-inspector.svg)](https://opensource.org/licenses/MIT)
[![GITHUB-language](https://img.shields.io/github/languages/top/zh-lx/codeplayer.svg)](https://github.com/zh-lx/codeplayer)

![image](https://github.com/zh-lx/code-inspector/assets/73059627/91c17020-570f-489a-9c45-6f1c0e5a86b7)

## Feature

- 支持代码在线编辑及实时预览
- 内置 `Vue3 / React / Typescript / Javascript / HTML / CSS / Less / Sass` 等多种代码解析器
- 支持通过导入 ESModule 格式(`import/export`) npm 包
- 支持多文件解析，并支持新增/删除文件
- 代码可压缩添加至 hash，通过外链分享

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

## Todo

- [x] 支持 vue3 代码运行
- [x] 支持 react 代码运行
- [x] 增加侧文件栏以支持文件新增/删除/重命名
- [x] 支持工具栏/上下/翻转等布局调整
- [ ] 支持 vue2 代码运行
- [ ] 支持其他框架如 svelte
