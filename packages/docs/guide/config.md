# 配置

你可以在 url 上或者页面 hash 上通过不同的参数，来对 CodePlayer 的功能进行配置，具体的参数及作用如下文所示。

## hash

- 类型: `string`
- 说明: url 上的 hash 部分。文件及代码的序列化字符串，具体请参照[序列化文件对象](/guide/start.html#_2-序列化文件对象)

## entry

- 类型: `string`
- 说明: 入口文件的文件名，必须是一个 html 文件。如果不指定，默认会以 `index.html` 作为入口文件的文件名。

## activeFile

- 类型: `string`
- 说明: 初始化选中并展示代码的文件的文件名。如果不指定，默认为入口文件。

## vueVersion

- 类型: `number`
- 可选值: `2 / 3`
- 说明: 指定 vue 的版本，默认使用 vue3 解析器，如果是使用 vue2，务必指定该项

## showFileBar

- 类型: `boolean`
- 默认值: `true`
- 说明: 是否显示侧文件栏

## showCode

- 类型: `boolean`
- 默认值: `true`
- 说明: 是否显示代码编辑区

## showPreview

- 类型: `boolean`
- 默认值: `true`
- 说明: 是否显示预览区

## showFileBar

- 类型: `boolean`
- 默认值: `true`
- 说明: 是否显示侧文件栏

## showEruda

- 类型: `boolean`
- 默认值: `true`
- 说明: 是否显示 eruda 控制台

## openConsole

- 类型: `boolean`
- 默认值: `false`
- 说明: 初始化是否默认打开 eruda 的控制台

## reverse

- 类型: `boolean`
- 默认值: `false`
- 说明: 是否翻转代码编辑区和预览区

## excludeTools

- 类型: `('refresh' | 'share' | 'docs' | 'git')[]`
- 默认值: `[]`
- 说明: 需要隐藏的工具栏按钮

## codeSize

- 类型: `number`
- 默认值: `14`
- 说明: 初始化的代码编辑区的字号

## theme

- 类型: `'dark' | 'light'`
- 默认值: `light`
- 说明: 主题色

## appType

- 类型: `string`
- 可选值: `vue2 / vue3 / react / js / ts / html`
- 默认值: `vue3`
- 说明: 指定该参数且未指定 `files` 参数时，会使用内置的模板初始化一个对应类型的项目

## document

- 类型: `string`
- 默认值: `https://play.fe-dev.cn/docs`
- 说明: 文档 icon 指向的地址

## github

- 类型: `string`
- 默认值: `https://github.com/zh-lx/codeplayer`
- 说明: Github icon 指向的地址
