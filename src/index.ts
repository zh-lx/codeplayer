import type { Options } from './components';
import './components';

interface CodeSandboxOptions extends Options {
  height?: number; // 高度
  showFilesControl?: boolean;
}

export default class CodeSandbox {
  constructor(el: HTMLElement | string, options: CodeSandboxOptions) {
    const container = typeof el === 'string' ? document.querySelector(el) : el;
    const codeSandbox = document.createElement('code-sandbox');
    codeSandbox.options = options;
    codeSandbox.height = options.height as number;
    container?.append(codeSandbox);
  }
}
