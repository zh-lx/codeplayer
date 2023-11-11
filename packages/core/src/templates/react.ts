import { MapFile } from '@/constant';

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodePlayer</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
  <script type="module">
    import './main.tsx';
  </script>
</html>
`.trim();

const mainTsx = `
import React from "react";
import { createRoot } from "react-dom/client";
import App from './App.tsx';

const root = createRoot(document.getElementById('app'));
root.render(<App />)
`.trim();

const appTsx = `
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
`.trim();

const importMap = `
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/": "https://esm.sh/react-dom@18.2.0/",
    "antd": "https://esm.sh/antd@5.8.5",
    "@antd/": "https://esm.sh/@antd@5.8.5/"
  }
}
`.trim();

export const ReactTemplate = {
  'index.html': indexHtml,
  'main.tsx': mainTsx,
  'App.tsx': appTsx,
  [MapFile]: importMap,
};
