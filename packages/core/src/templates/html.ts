import { MapFile } from '@/constant';

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code player</title>
    <link href="//unpkg.com/layui@2.8.16/dist/css/layui.css" rel="stylesheet">
  </head>
  <body>
    <div class="layui-btn-container">
      <button type="button" class="layui-btn">默认按钮</button>
      <button type="button" class="layui-btn layui-bg-blue">蓝色按钮</button>
      <button type="button" class="layui-btn layui-bg-orange">橙色按钮</button>
      <button type="button" class="layui-btn layui-bg-red">红色按钮</button>
      <button type="button" class="layui-btn layui-bg-purple">紫色按钮</button>
      <button type="button" class="layui-btn layui-btn-disabled">禁用按钮</button>
    </div>
    
    <div class="layui-btn-container">
      <button class="layui-btn layui-btn-primary layui-border-green">主色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-blue">蓝色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-orange">橙色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-red">红色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border-purple">紫色按钮</button>
      <button class="layui-btn layui-btn-primary layui-border">普通按钮</button>
    </div>
  </body>
</html>
`.trim();

const importMap = `
{
  "imports": {
    "layui": "https://esm.sh/layui@2.8.16",
    "layui/": "https://esm.sh/layui@2.8.16/"
  }
}
`.trim();

export const HtmlTemplate = {
  'index.html': indexHtml,
  [MapFile]: importMap,
};
