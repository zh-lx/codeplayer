# 配置

你可以在 url 上通过不同的参数，来对 CodePlayer 的功能进行配置，具体的参数及作用如下文所示。

## files

- 类型: `string`
- 说明: 文件及代码的序列化字符串，具体请参照[序列化文件对象](/guide/start.html#_2-序列化文件对象)

## entry

- 类型: `string`
- 说明: 入口文件的文件名，必须是一个 html 文件。如果不指定，默认会以 `index.html` 作为入口文件的文件名。

## activeFile

- 类型: `string`
- 说明: 初始化选中并展示代码的文件的文件名。如果不指定，默认为入口文件。

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

## showConsole

- 类型: `boolean`
- 默认值: `false`
- 说明: 初始化是否显示 eruda 的控制台

## reverse

- 类型: `boolean`
- 默认值: `false`
- 说明: 是否翻转代码编辑区和预览区

## excludeTools

- 类型: `('refresh' | 'share')[]`
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
