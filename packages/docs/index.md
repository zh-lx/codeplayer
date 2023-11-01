---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'CodePlayer'
  # text: 'A Magic Tool for Developing'
  # tagline: Click the dom on the page, it can locate the dom's source code in the IDE
  text: '极致速度的 WebIDE'
  tagline: 一款轻量的、极快运行速度、免登录使用的 WebIDE
  image:
    src: /logo.svg
    alt: logo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/start
    - theme: alt
      text: 加入用户群
      link: /more/feedback

features:
  - icon: 🚀
    title: 极致的运行速度
    details: 3 秒内完成依赖安装、代码编译及运行等全部过程，速度远超 CodeSandbox、Stackblitz 等同类型产品
  - icon: 📖
    title: 免登录直接使用
    details: 无需注册登录，直接在线编写 demo，demo 文件及代码将通过 Hash 和压缩后自动同步至 url 进行保存及分享
  - icon: 🎨
    title: 广泛的语法支持
    details: 支持 html、javascript、typescript、react、vue、css、less、sass 等多种 web 相关的代码编写和运行
---
