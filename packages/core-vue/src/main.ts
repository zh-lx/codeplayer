import { defineCustomElement } from 'vue';
import CodeSandboxVue from './components/index.ce.vue';
import globalStyle from '@/style/global.less?inline';
import { CodeSandboxOptions, HTMLCodeSandboxElement } from './type';
import { dialog } from './utils';
// dialog({
//   title: '提示',
//   content: '确认要删除该文件吗',
// });

const CodeSandboxClass = defineCustomElement(CodeSandboxVue);

customElements.define('code-sandbox', CodeSandboxClass);

// 添加全局样式
(function () {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerText = globalStyle;
  document.body.append(style);
})();

export default class CodeSandbox {
  constructor(el: HTMLElement | string, options: CodeSandboxOptions) {
    const container = typeof el === 'string' ? document.querySelector(el) : el;
    const codeSandbox = document.createElement('code-sandbox');
    codeSandbox.options = options;
    container?.append(codeSandbox);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-sandbox': HTMLCodeSandboxElement;
  }
}
