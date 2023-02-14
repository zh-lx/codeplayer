import { defineCustomElement } from 'vue';
import CodeSandboxVue from './components/index.ce.vue';
import globalStyle from '@/style/global.less?inline';
import { CodeSandboxOptions, HTMLCodeSandboxElement } from './type';

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
    for (let key in options) {
      // @ts-ignore
      codeSandbox[key] = options[key];
    }
    container?.append(codeSandbox);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-sandbox': HTMLCodeSandboxElement;
  }
}
