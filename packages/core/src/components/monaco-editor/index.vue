<template>
  <div class="codeplayer-monaco-edito-outer">
    <div class="codeplayer-monaco-editor" ref="containerRef"></div>
    <CopyIcon class="code-copy-icon" />
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  ref,
  shallowRef,
  nextTick,
  watch,
  computed,
} from 'vue';
import * as monaco from 'monaco-editor';
import { initMonaco } from './env';
import { getOrCreateModel } from './utils';
import { loadGrammars, loadTheme } from 'monaco-volar';
import { store } from '@/store';
import { getFileLanguage, getFileExtraName } from '@/compiler';
import CopyIcon from '@/components/toolbar/icons/copy.vue';

const containerRef = ref<HTMLDivElement>();
const ready = ref(false);
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>();

initMonaco(store);

const lang = computed(() =>
  ['css', 'less', 'sass', 'scss'].includes(getFileExtraName(store.activeFile))
    ? 'css'
    : 'javascript'
);

const tempJsModel = getOrCreateModel(
  monaco.Uri.parse(`file:///temp.js`),
  'javascript',
  'let temp = 1'
);

onMounted(async () => {
  const theme = await loadTheme(monaco.editor as any);
  ready.value = true;
  await nextTick();

  if (!containerRef.value) {
    throw new Error('Cannot find containerRef');
  }

  const editorInstance = monaco.editor.create(containerRef.value, {
    value: store.files[store.activeFile]?.code || '',
    language: lang.value,
    fontSize: 13,
    theme: theme[store.theme],
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    inlineSuggest: {
      enabled: false,
    },
    'semanticHighlighting.enabled': true,
    fixedOverflowWidgets: true,
  });
  editor.value = editorInstance;

  // Support for semantic highlighting
  const t = (editorInstance as any)._themeService._theme;
  t.getTokenStyleMetadata = (
    type: string,
    modifiers: string[],
    _language: string
  ) => {
    const _readonly = modifiers.includes('readonly');
    switch (type) {
      case 'function':
      case 'method':
        return { foreground: 12 };
      case 'class':
        return { foreground: 11 };
      case 'variable':
      case 'property':
        return { foreground: _readonly ? 21 : 9 };
      default:
        return { foreground: 0 };
    }
  };

  watch(
    () => store.activeFile,
    async (_, oldFilename) => {
      console.log(_);
      if (!editorInstance) return;
      const file = store.files[store.activeFile];
      if (!file) return null;

      const model = getOrCreateModel(
        monaco.Uri.parse(`file:///${store.activeFile}`),
        getFileLanguage(store.activeFile),
        file.code
      );

      const oldFile = oldFilename ? store.files[oldFilename] : null;
      if (oldFile) {
        oldFile.editorViewState = editorInstance.saveViewState();
      }

      editorInstance.setModel(model);

      if (file.editorViewState) {
        editorInstance.restoreViewState(file.editorViewState);
        editorInstance.focus();
      }

      monaco.editor.setModelLanguage(model!, 'javascript');
      if (
        ['.css', '.less', '.sass', '.scss'].includes(
          getFileExtraName(store.activeFile)
        )
      ) {
        nextTick(() => {
          monaco.editor.setModelLanguage(tempJsModel!, 'css');
        });
      }
    },
    { immediate: true }
  );

  await loadGrammars(monaco as any, editorInstance as any);

  editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // ignore save event
  });

  editorInstance.onDidChangeModelContent(() => {
    store.files[store.activeFile].code = editorInstance.getValue();
  });

  store.reloadLanguageTools();

  watch(
    () => store.codeSize,
    () => {
      editorInstance.updateOptions({
        fontSize: store.codeSize,
      });
    },
    {
      immediate: true,
    }
  );

  watch(
    () => store.theme,
    (n) => {
      editorInstance.updateOptions({
        theme: n === 'light' ? theme.light : theme.dark,
      });
    },
    { immediate: true }
  );
});

onBeforeUnmount(() => {
  editor.value?.dispose();
});
</script>

<style scoped lang="less">
@import '@/style/base.less';
.codeplayer-monaco-edito-outer {
  position: relative;
  height: 100%;
  .codeplayer-monaco-editor {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .code-copy-icon {
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 999;
    display: none;
  }
  &:hover {
    .code-copy-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--codeplayer-copy-icon-color);
      box-shadow: var(--codeplayer-copy-shadow);
      border-radius: 0;
      border-bottom-left-radius: 2px;
      &:hover {
        color: var(--codeplayer-brand-active);
      }
    }
  }
}
</style>
