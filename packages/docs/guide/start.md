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

使用 `JSON.stringify()` 方法，将上述得到的文件对象 `files` 转换为 JSON 字符串，然后使用 `window.btoa()` 序列化该字符串并使用 `encodeURIComponent()` 将字符串进行编码，最终得到的值即为 `hash` 值。

```js
const files = encodeURIComponent(window.btoa(JSON.stringify(files)));

window.open(`https://play.fe-dev.cn#${files}`);
```

最终生成的 [url](http://play.fe-dev.cn#eNo9j09PwzAMxb%2BKCYduUpcIDmh03S78OQIS44AImrIm0KImKUmKNk377jhNt5Ot5%2Feznw%2BkMVLtaB10SwpSXtw%2F363fXx4gCituylihFeZ7yYkynKAGUNZKyKHDXqsgoKqF8yqg6W39OJtzAiw52dlabq3cnyDZ%2FK202IHp9Va5AkrfCQONxAUo45mSRQVLdKZNZ770lWu6AGHfqQhY2bdqjAbQ6M66ABllWjSGBp8tEp%2Bo%2BBQbviM53hoc%2BPlIbeDLWQ1Za6XwdSQra3wYc3pYwsd1Dlc5zHO4zeHm8%2BzA2E%2B9RsOGYjsZgSnOpa16rUygv71y%2B1fVqipYN8ku0ZdNaWOMcmu1C8imJQtMlvLMtOjoj7cGEx7iF3wceE4KGJSopbRR4qQOofMFY8pr6mt2GkXrkZsjOf4D9xSi7Q%3D%3D) 在 CodePlayer 上对应的运行效果如下图所示：

<img style="border: 1px solid #eee;" src="https://github.com/zh-lx/codeplayer/assets/73059627/33743b77-e720-4a24-a56f-1142daa23491" />
