# 如何使用 CodePlayer

CodePlayer 本质上是解析 url 参数上的 `codeplayer_files` 字段，初始化对应的文件及代码，并将代码及运行结果呈现到页面上。

一个 CodePlayer Demo 的访问链接格式应该如下：

```
https://play.fe-dev.cn/?codeplayer_files=xxx
```

## CodePlayer Url 生成

要生成一个 demo 对应 CodePlayer url，核心为将 demo 代码转换为对应的 `codeplayer_files` 参数的值，接下来我们通过一个案例来了解如何将代码转换为 `codeplayer_files` 参数的值，该 demo 包含下列文件：

::: code-group

```html [index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div>max number: <span id="max"></span></div>
  </body>
  <script type="module">
    import './main.ts';
  </script>
</html>
```

```ts [main.ts]
import _ from 'lodash';
const numbers = [2, 1, 8, 9, 6];
const maxNum = _.max(numbers);
document.querySelector('#max').innerText = maxNum;
```

```json [import-map.json]
{
  "imports": {
    "lodash": "https://esm.sh/lodash"
  }
}
```

:::

### 1. 构建文件对象

首先，将上述文件以 `{ 文件名: 代码 }` 的格式构建一个 js 键值对对象，构建后的对象应如下：

```js
const files = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div>max number: <span id="max"></span></div>
  </body>
  <script type="module">
    import './main.ts';
  </script>
</html>`,
  'main.ts': `import _ from 'lodash';
const numbers = [2, 1, 8, 9, 6];
const maxNum = _.max(numbers);
document.querySelector('#max').textContent = maxNum;`,
  'import-map.json': `{
  "imports": {
    "lodash": "https://esm.sh/lodash"
  }
}`,
};
```

### 2. 序列化文件对象

使用 `JSON.stringify()` 方法，将上述得到的文件对象 `files` 转换为 JSON 字符串，然后使用 `window.btoa()` 序列化该字符串并使用 `encodeURIComponent()` 将字符串进行编码，最终得到的值即为 `codeplayer_files` 参数的值。将该值作为 url 参数访问 `https://play.fe-dev.cn` 即可展示并运行对应的代码。

```js
const codeplayer_files = encodeURIComponent(window.btoa(JSON.stringify(files)));

window.open(`https://play.fe-dev.cn/?codeplayer_files=${codeplayer_files}`);
```

## 第三方依赖

在 CodePlayer 中，所有的第三方依赖都是通过现代浏览器支持的 `importMap` 特性处理的，你需要在一个名为 `import-map.json` 的 JSON 文件的 `imports` 字段中，声明所使用的第三方库对应的 `esm` 规范的文件映射。

:::tip 注意事项
你只需要在 `import-map.json` 文件中声明第三方依赖的映射即可，不需要在 html 文件中添加 `<script type="importmap"></script>` 这个标签，因为 CodePlayer 内部会自动完成这部分工作。
:::

更多有关于 `importMap` 相关的内容，可以在 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap) 中了解。

### esm 文件地址

所以通过 npm 公共源发布的第三方库，都可以在 [esm.sh](https://esm.sh) 上找到对应的 esm 规范的文件: `https://esm.sh/<package_name>@<version>` 即为第三方库对应版本的地址。

例如 `react 18.2.0` 版本的对应 esm 规范文件地址为：

```
https://esm.sh/react@18.2.0
```

### import-map.json 万能法则

如果你不太明白如何正确地在 `import-map.json` 中声明所有的第三方依赖，可以参考这个法则：无论使用了哪个第三方库，都在 `import-map.json` 的 `imports` 字段中添加以下两行：

```json
{
  "imports": {
    // others...
    // 直接引入库
    "<package_name>": "https://esm.sh/<package_name>@<version>",
    // 直接引入库中的文件
    "<package_name>/": "https://esm.sh/<package_name>@<version>/"
  }
}
```

例如，使用了 `element-plus` 的 `2.3.12` 版本，则添加以下代码：

```json
{
  "imports": {
    // others...
    "element-plus": "https://esm.sh/element-plus@2.3.12",
    "element-plus/": "https://esm.sh/element-plus@2.3.12/"
  }
}
```

## 入口文件

CodePlayer 默认约定入口文件为一个名为 `index.html` 的文件，并且会从该文件开始构建文件依赖图并运行代码。

你也可以通过 url 上的 `entry` 参数自定义入口文件。
