# 如何使用 CodePlayer

CodePlayer 本质上是解析 url 参数上的 `codeplayer_files` 字段，初始化对应的文件及代码，并将代码及运行结果呈现到页面上。

一个 CodePlayer Demo 的访问链接格式应该如下：

```
https://play.fe-dev.com/?codeplayer_files=xxx
```

## codeplayer_files

接下来我们通过一个 demo 来了解如何将代码转换为 `codeplayer_files` 参数的值，该 demo 包含下列文件：

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
document.querySelector('#max').innerText = maxNum;`,
  'import-map.json': `{
  "imports": {
    "lodash": "https://esm.sh/lodash"
  }
}`,
};
```

### 2. 序列化文件对象

## 使用

虽然本身是一个 web component 组件，但是因为许多参数是引用类型，更推荐以一个类实例的方式去使用：

```js
import CodePlayer from 'codeplayer';

new CodePlayer('#codeplayer', {
  appType: 'react',
  activeFile: 'App.tsx',
  excludeTools: ['code', 'share', 'reverse', 'preview', 'fileBar'],
});
```

## CodePlayer 参数说明

CodePlayer 类的类型如下所示，其构造函数接收两个参数：

- el: CodePlayer 要挂载的节点，是一个 dom 或者选择器字符串
- options: CodePlayer 的配置，详细见下表

```ts
class CodePlayer {
  constructor(el: HTMLElement | string, options: CodePlayerOptions) {
    //
  }
}
```

CodePlayerOptions 详细说明：

<table class="options-table">
    <tr>
        <th style="width: 100px;">属性</th>
        <th style="width: 90px">类型</th>
        <th>描述</th>
        <th>可选值</th>
        <th width="100">默认值</th>
    </tr>
    <!-- height -->
    <tr>
        <td>height</td>
        <td>number</td>
        <td>组件的固定高度，不设置此项时组件高度随内容自动变化</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>showFileBar</td>
        <td>boolean</td>
        <td>是否默认展示侧文件栏</td>
        <td><code>true/false</code></td>
        <td><code>true</code></td>
    </tr>
    <tr>
        <td>showCode</td>
        <td>boolean</td>
        <td>是否默认展示代码编辑器</td>
        <td><code>true/false</code></td>
        <td><code>true</code></td>
    </tr>
    <tr>
        <td>showPreview</td>
        <td>boolean</td>
        <td>是否默认展示预览区</td>
        <td><code>true/false</code></td>
        <td><code>true</code></td>
    </tr>
    <tr>
        <td>showToolbar</td>
        <td>boolean</td>
        <td>是否默认工具栏</td>
        <td><code>true/false</code></td>
        <td><code>true</code></td>
    </tr>
    <tr>
        <td>mainFile</td>
        <td>string</td>
        <td>入口文件(编译时)的文件名，未设置时默认会将第一个文件作为入口文件</td>
        <td><code>-</code></td>
        <td><code>-</code></td>
    </tr>
    <tr>
        <td>activeFile</td>
        <td>string</td>
        <td>编译器默认展示代码的文件的文件名</td>
        <td><code>-</code></td>
        <td><code>-</code></td>
    </tr>
    <tr>
        <td>initFiles</td>
        <td>string</td>
        <td>初始化文件 map，格式为：<code>Record&lt;filename, code&gt;</code></td>
        <td><code>-</code></td>
        <td><code>-</code></td>
    </tr>
    <tr>
        <td>appType</td>
        <td>string</td>
        <td>若未设置 initFiles，会根据 appType 自动初始化内置的 demo</td>
        <td><code>vue/vue3/react/html/javascript/typescript</code></td>
        <td><code>typescript</code></td>
    </tr>
    <tr>
        <td>excludeTools</td>
        <td>string[]</td>
        <td>要隐藏的工具栏按钮列表</td>
        <td><code>('toolbar'|'fileBar'|'code'|'preview'|'refresh'|'reverse'|'copy'|'share')[]</code></td>
        <td><code>[]</code></td>
    </tr>
    <tr>
        <td>vertical</td>
        <td>boolean</td>
        <td>代码编辑区-web预览区是否垂直布局</td>
        <td><code>true/false</code></td>
        <td><code>false</code></td>
    </tr>
    <tr>
        <td>reverse</td>
        <td>boolean</td>
        <td>代码编辑区-web预览区是否位置翻转</td>
        <td><code>true/false</code></td>
        <td><code>false</code></td>
    </tr>
    <tr>
        <td>toolbarPosition</td>
        <td>string</td>
        <td>工具栏位置，默认值为 top</td>
        <td><code>top/bottom</code></td>
        <td><code>top</code></td>
    </tr>
    <tr>
        <td>css</td>
        <td>string</td>
        <td>用于自定义样式的 Css styleSheet 字符串</td>
        <td><code>-</code></td>
        <td><code>-</code></td>
    </tr>
</table>
