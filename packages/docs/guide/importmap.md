# 第三方依赖(importmap)

在 CodePlayer 中，第三方依赖库是在一个名为 `import-map.json` 的文件中声明和引入的，这借助了浏览器的 [importmap](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap) 特性。

:::tip 注意
CodePlayer 会自动创建一个 `<script type="importmap"></script>` 标签，并将 `import-map.json` 中的内容插入到这个标签中。你只需要在 `import-map.json` 中声明依赖，无需关注 `<script type="importmap"></script>` 标签的创建。
:::

## import-map.json

浏览器标准的 `import-map.json` 包括 `imports` 和 `scopes` 两个字段，在 CodePlayer 中，所有的第三方库都在 `imports` 中声明，无需使用 `scopes`。格式如下：

```json
{
  "imports": {
    "包名": "包对应的 esm 格式文件地址"
  }
}
```

### esm 文件地址

由于 `import` 是使用了现代浏览器的 esm 规范，所以第三方库映射的文件必须为 esm 规范的文件。

所有通过 npm 公共源发布的第三方库，都可以在 [esm.sh](https://esm.sh) 上找到对应的 esm 规范的文件: `https://esm.sh/<package_name>@<version>` 即为第三方库对应版本的地址。

例如 `react 18.2.0` 版本的对应 esm 规范文件地址为：`https://esm.sh/react@18.2.0`

对应的 `import-map.json` 应为：

```json
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0"
  }
}
```

当你使用 `react` 库时，浏览器就会根据 `import-map.json` 自动进行映射：

```js
import { useState } from 'react';

// 等同于转换为

import { useState } from 'https://esm.sh/react@18.2.0';
```

### 映射模块前缀

假设现在你要使用以下代码：

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

上述代码和 `react` 的不同之处是，从 `react-dom` 的 `client` 路径下引入了 api，而非直接从包本身引入了 api。

我们还可能从 `react-dom` 的其他路径下引入其他 api，`importmap` 的映射模块前缀特性可以让我们便捷地支持这种情况：

```json
{
  "imports": {
    "react-dom/": "https://esm.sh/react-dom@18.2.0/"
  }
}
```

只需要在包名及映射的 esm 路径后面都加一个 `/`，就可以进行路径的映射。

### 万能法则

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
