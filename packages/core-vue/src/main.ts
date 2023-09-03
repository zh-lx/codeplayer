import { defineCustomElement } from 'vue';
import CodePlayerVue from './components/index.ce.vue';
import globalStyle from '@/style/global.less?inline';
import MenuStyle from '@/components/menus/index.less?inline';
import { CodePlayerOptions, HTMLCodePlayerElement } from './type';

const CodePlayerClass = defineCustomElement(CodePlayerVue);

customElements.define('code-player', CodePlayerClass);

// 添加全局样式
(function () {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerText = globalStyle + '\n' + MenuStyle;
  document.body.append(style);
})();

export default class CodePlayer {
  constructor(el: HTMLElement | string, options: CodePlayerOptions) {
    const container = typeof el === 'string' ? document.querySelector(el) : el;
    const codePlayer = document.createElement('code-player');
    codePlayer.options = options;
    container?.append(codePlayer);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-player': HTMLCodePlayerElement;
  }
}
