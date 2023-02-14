import { defineCustomElement } from 'vue';
import CodeSandboxVue from './components/index.ce.vue';
import '@/style/global.ts';
import { CodeSandboxOptions, HTMLCodeSandboxElement } from './type';

const CodeSandboxClass = defineCustomElement(CodeSandboxVue);

customElements.define('code-sandbox', CodeSandboxClass);

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
