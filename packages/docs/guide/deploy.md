# 私有化部署

## 如何私有化部署

CodePlayer 是一个 web component 组件，所以本身也可以作为一个网页进行私有化部署，步骤如下:

- 执行如下命令 clone codeplayer 的 github 仓库

```perl
git clone https://github.com/zh-lx/codeplayer.git
```

- 进入项目目录，安装依赖:

```perl
cd ./codeplayer
yarn install
```

- 进入对应目录，打包网页

```perl
cd ./packages/core
yarn build:web
```

打包结束后，`/packages/core/dist` 即为打包产物，将打包产物托管到自己的静态资源服务器上即可。

### 如何修改 CodePlayer 配置

相关的样式可在 `/packages/core/index.html` 中修改 CodePlayer 的配置，具体配置同 [参数说明](/guide/start.html#codeplayer-参数说明)

### 将 demo 代码带入 CodePlayer 运行

CodePlayer 修改代码会将文件列表及代码编译压缩后同步至页面的 hash 上，同样页面访问时也会将 hash 解析后初始化文件列表及代码。

以 react antd 的 demo 为例，demo 代码如下：

```tsx
import React from 'react';
import { Button, Space } from 'antd';

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </Space>
);

export default App;
```

则对应要打开的网页如下：

```ts
const demoCode = `import React from 'react';
import { Button, Space } from 'antd';

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </Space>
);

export default App;`;

const entryCode = `import React from "react";
import { createRoot } from "react-dom/client";
import App from './App.tsx';

const root = createRoot(document.getElementById('app'));
root.render(<App />);`;

const importMapCode = `{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "antd": "https://esm.sh/antd@5.8.5"
  }
}`;

const fileMap = {
  'main.tsx': entryCode,
  'App.tsx': demoCode,
  'import-map.json': importMapCode,
};

const hash = window.btoa(JSON.stringify(fileMap));
// 将域名替换为你自己私有化部署的域名
window.open('https://sandbox.fe-dev.cn/' + '#' + hash);
```
