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
    details: 可以在 3 秒内完成依赖安装、代码的编译及运行，速度远超 CodeSandbox/Stackblitz/CodePen 等同类型的产品
  - icon: 📖
    title: 免登录直接使用
    details: 无需登录即可在线编写 demo 使用，文件及代码通过 Hash 和压缩后自动同步至 url，可以通过 url 一键分享或者保存
  - icon: 🎨
    title: 广泛的语法支持
    details: 支持 html、javascript、typescript、react、vue、css、less、sass 等多种 web 相关的语法的代码编写和运行
---
