---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'CodePlayer'
  # text: 'A Magic Tool for Developing'
  # tagline: Click the dom on the page, it can locate the dom's source code in the IDE
  text: '代码编写及预览工具'
  tagline: 在浏览器端进行 Web 代码的编写及运行预览
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
    details: 可以在 1 秒内完成代码的编译及运行预览，运行速度远超 CodeSandbox/Stackblitz/CodePen 等同类型的产品
  - icon: 📖
    title: 轻量的安装方式
    details: 本身是一个基于 web component 的组件，既可以作为组件在各种框架中安装使用，也可以作为一个网站私有化部署
  - icon: 🎨
    title: 广泛的语法支持
    details: 支持 html、javascript、typescript、react、vue、css、less、sass 等多种web前端相关的语法及框架的代码编写和运行
---
