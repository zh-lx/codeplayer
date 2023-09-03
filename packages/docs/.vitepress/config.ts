import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'CodePlayer',
  description: '浏览器端进行 Web 代码的编写及运行预览',
  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    // nav: [{ text: '首页', link: '/' }],
    search: {
      provider: 'local',
    },
    outline: [2, 3],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '使用', link: '/guide/start' },
          { text: '私有化部署', link: '/guide/deploy' },
        ],
      },
      {
        text: '更多',
        items: [{ text: '交流与反馈', link: '/more/feedback' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zh-lx/codeplayer' },
    ],
  },
  // locales: {
  //   root: {
  //     label: '简体中文',
  //     lang: 'zh',
  //   },
  //   fr: {
  //     label: 'English',
  //     lang: 'en',
  //     link: 'https://en.inspector.fe-dev.cn', // default /fr/ -- shows on navbar translations menu, can be external
  //   },
  // },
});