import { StoreOptions } from './store';
import CodeSandbox from '../components/code-sandbox';

export const Sandbox = async ({
  el,
  options = {},
}: {
  el: HTMLElement;
  options?: StoreOptions;
}) => {
  new CodeSandbox({ el, options });
};
