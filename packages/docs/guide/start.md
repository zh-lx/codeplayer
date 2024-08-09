# 如何使用 CodePlayer

CodePlayer 本质上是解析 url 上的 `hash` 值，初始化对应的文件及代码，并将代码及运行结果呈现到页面上。

一个 CodePlayer Demo 的访问链接格式应该如下：

```
https://play.fe-dev.cn#xxx
```

## 示例

使用 CodePlayer 展示 demo 的核心是将 demo 的代码转换为 url 的 `hash`。接下来我们通过一个案例来了解如何将代码转换为 `hash`，该 demo 包含下列文件：

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

首先，将上述文件以 `{ 文件名: 文件代码 }` 的格式构建一个 js 键值对对象，构建后的对象应如下：

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

使用 `JSON.stringify()` 方法，将上述得到的文件对象 `files` 转换为 JSON 字符串，然后使用 `window.btoa()` 序列化将字符串进行编码，最终得到的值即为 `hash` 值。

```js
const files = window.btoa(JSON.stringify(files));

window.open(`https://play.fe-dev.cn#${files}`);
```

最终生成的 [url](http://play.fe-dev.cn#eyJpbmRleC5odG1sIjoiPCFET0NUWVBFIGh0bWw+XG48aHRtbCBsYW5nPVwiZW5cIj5cbiAgPGhlYWQ+XG4gICAgPG1ldGEgY2hhcnNldD1cIlVURi04XCIgLz5cbiAgPC9oZWFkPlxuICA8Ym9keT5cbiAgICA8ZGl2Pm1heCBudW1iZXI6IDxzcGFuIGlkPVwibWF4XCI+PC9zcGFuPjwvZGl2PlxuICA8L2JvZHk+XG4gIDxzY3JpcHQgdHlwZT1cIm1vZHVsZVwiPlxuICAgIGltcG9ydCAnLi9tYWluLnRzJztcbiAgPC9zY3JpcHQ+XG48L2h0bWw+IiwibWFpbi50cyI6ImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5jb25zdCBudW1iZXJzID0gWzIsIDEsIDgsIDksIDZdO1xuY29uc3QgbWF4TnVtID0gXy5tYXgobnVtYmVycyk7XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWF4JykudGV4dENvbnRlbnQgPSBtYXhOdW07IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwibG9kYXNoXCI6IFwiaHR0cHM6Ly9lc20uc2gvbG9kYXNoXCJcbiAgfVxufSJ9) 在 CodePlayer 上对应的运行效果如下图所示：

<img style="border: 1px solid #eee;" src="https://github.com/zh-lx/codeplayer/assets/73059627/33743b77-e720-4a24-a56f-1142daa23491" />
