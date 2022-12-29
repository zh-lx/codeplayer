import { ReplStore, StoreOptions } from './store';
import { compileModulesForPreview } from './module-compiler';
import { createSandbox } from '../components/sandbox';

export const Sandbox = async ({
  el,
  options = {},
}: {
  el: HTMLElement;
  options?: StoreOptions;
}) => {
  const store = new ReplStore(options);

  await store.init();

  const modules = compileModulesForPreview(store);

  createSandbox(el, store, modules);
};
