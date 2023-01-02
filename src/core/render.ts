import { ReplStore, StoreOptions } from './store';
import { compileModulesForPreview } from './module-compiler';
import { createSandbox } from '../components/sandbox';
import { createCodeMirror } from '../components/codemirror';
import { createCodeSandbox } from '../components/code-sandbox';

export const Sandbox = async ({
  el,
  options = {},
}: {
  el: HTMLElement;
  options?: StoreOptions;
}) => {
  createCodeSandbox(el, options);
};
