import { webpackBundler } from '@vuepress/bundler-webpack';
import { defineUserConfig } from '@vuepress/cli';
import WriteTheme from '../../node_modules/vuepress-theme-write';
import sidebar from './sidebar';
import { getDirname, path } from '@vuepress/utils';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  title: 'CodeSandbox',
  description:
    '一个跨框架通用的浏览器编写代码并实时运行的组件，支持 vue/react 等多种代码编写及运行',
  theme: WriteTheme({
    logo: '/images/code-sandbox.svg',
    // @ts-ignore
    type: 'docs',
    sidebar,
    sidebarDepth: 6,
  }),
  alias: {
    // NavbarExtra: path.resolve(__dirname, './components/navbar-extra.vue'),
    // HomeFooter: path.resolve(__dirname, './components/home-footer.vue'),
  },
  // clientConfigFile: path.resolve(__dirname, './components/app.ts'),
  bundler: webpackBundler({}),
  define: {
    $Site: {
      title: 'CodeSandbox',
      description:
        '一个支持在浏览器编写并运行 react/vue/ts 等前端代码的 UI 组件',
      start: '快速上手',
      startPath: '/guide/start.md',
      type: 'docs',
      hidePageMeta: true,
      homeImg: '/images/code-sandbox.svg',
    },
    $HomeItems: [
      {
        title: '开箱即用',
        text: '只需要几行代码，就可以直接在浏览器中引入使用，几乎没有任何上手成本',
        img: '/images/function.png',
      },
      {
        title: '多语法支持',
        text: '支持 html/css/js/ts/react/vue/json 等多种前端语言及框架',
        img: '/images/rainbow.png',
      },
      {
        title: '多元化配置',
        text: '通过丰富的配置参数，可以根据不同场景及需求自由配置 UI 面板的结构',
        img: '/images/setting.png',
      },
    ],
  },
});
