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
  </body>
  <script type="module">
    import './index.js';
  </script>
</html>
`.trim();

const indexJs = `
import layui from "layui";
import "layui/dist/css/layui.css";

layer.open({
  type: 1, // page 层类型
  area: ['500px', '300px'],
  title: 'Hello layer',
  shade: 0.6, // 遮罩透明度
  shadeClose: true, // 点击遮罩区域，关闭弹层
  maxmin: true, // 允许全屏最小化
  anim: 0, // 0-6 的动画形式，-1 不开启
  content: '<div style="padding: 32px;">一个普通的页面层，传入了自定义的 HTML</div>'
});
`.trim();

const importMap = `
{
  "imports": {
    "layui": "https://esm.sh/layui@2.8.16",
    "layui/": "https://esm.sh/layui@2.8.16/"
  }
}
`.trim();

export const JsTemplate = {
  'index.html': indexHtml,
  'index.js': indexJs,
  [MapFile]: importMap,
};
