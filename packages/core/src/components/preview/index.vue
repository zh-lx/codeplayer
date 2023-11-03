<script setup lang="ts">
import { ref, Ref, onMounted, watch } from 'vue';
import { store } from '@/store';
import { modulesKey, exportKey, dynamicImportKey, MapFile } from '@/constant';
import { Compiler } from '@/compiler';
import {
  Hooks,
  ComplierPluginParams,
  ComplierPluginResult,
} from '@/compiler/type';

interface IframeWindow extends Window {
  process: Record<string, any>;
  [modulesKey]: Record<string, any>;
  [exportKey]: Function;
  [dynamicImportKey]: Function;
  __next__: Function;
}

const errors = ref<string[]>([]);
const previewDOM = ref() as Ref<HTMLDivElement>;
const iframe = ref<HTMLIFrameElement>();

const erudaPlugin = (hooks: Hooks) => {
  hooks.hook(
    'before-emit',
    (_: ComplierPluginParams, items: ComplierPluginResult) => {
      items.modules.unshift(
        `import eruda from 'https://esm.sh/eruda@3.0.1';
if (window.__eruda) {
  window.__eruda.destroy();
}
window.__eruda = eruda;
eruda.init();`.trim()
      );
    }
  );

  hooks.hook('after-emit', () => {
    if (iframe.value?.contentWindow?.__eruda) {
      if (store.showConsole) {
        iframe.value.contentWindow.__eruda.show();
      }
      iframe.value.contentWindow.__eruda._entryBtn._events.click.push(() => {
        // eruda transition is 0.3s
        setTimeout(() => {
          const devtools =
            iframe.value?.contentWindow?.__eruda?._shadowRoot?.querySelector?.(
              '.eruda-dev-tools'
            ) as any;
          const display = devtools.computedStyleMap()?.get?.('display')?.value;
          store.showConsole = display === 'block';
        }, 300);
      });
    }
  });
};

const compiler = new Compiler({ plugins: [erudaPlugin] });

onMounted(() => {
  renderSandbox();
});

// watch edit file
watch(
  () => [store.activeFile, store.files[store.activeFile]?.code],
  (newV, oldV) => {
    if (newV?.[0] !== oldV?.[0]) {
      return;
    }
    if (store.activeFile === MapFile) {
      renderSandbox();
    } else {
      refreshSandbox();
    }
  },
  { deep: true }
);

// watch add a new file or delete a file
watch(
  () => store.files,
  (newV, oldV) => {
    const newFiles = Object.keys(newV).sort();
    const oldFiles = Object.keys(newV).sort();
    if (
      newFiles.length === oldFiles.length &&
      newFiles.every((file, index) => file === oldFiles[index])
    ) {
      return;
    }
    refreshSandbox();
  },
  { deep: true }
);

watch(() => store.rerenderID, renderSandbox);

async function renderSandbox() {
  if (!previewDOM.value) {
    return;
  }

  // 建立一个新的 iframe
  iframe.value?.remove();
  iframe.value = document.createElement('iframe');
  iframe.value.className = 'codeplayer-iframe';
  previewDOM.value.append(iframe.value);

  const result = { errors: [] };
  await compiler.run({
    fileMap: store.files,
    result,
    entry: store.mainFile,
    iframe: iframe.value as HTMLIFrameElement,
    render: true,
  });
  errors.value = result.errors;
}

async function refreshSandbox() {
  if (!previewDOM.value) {
    return;
  }
  // 建立一个新的 iframe
  const result = { errors: [] };
  await compiler.run({
    fileMap: store.files,
    result,
    entry: store.mainFile,
    iframe: iframe.value as HTMLIFrameElement,
    render: false,
  });
  errors.value = result.errors;
}
</script>

<template>
  <div class="codeplayer-iframe-container" ref="previewDOM"></div>
</template>
