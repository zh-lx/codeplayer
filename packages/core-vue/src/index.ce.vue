<script setup lang="ts">
import { defineProps, watch, computed } from 'vue';
import { store } from '@/store';
import { MapFile } from '@/constant';
import { atou, getTemplate, File } from '@/utils';
import { type CodeSandboxOptions } from './main';
import Toolbar from './components/toolbar/index.vue';
import Splitter from './components/splitter/index.vue';
import FileBar from './components/file-bar/index.vue';
import CodeEditor from './components/code-editor/index.vue';
import Preview from './components/preview/index.vue';

const props = defineProps<{ options?: CodeSandboxOptions }>();

const CodeSlotName = computed(() => (store.reverse ? 'right' : 'left'));
const PreviewSlotName = computed(() => (store.reverse ? 'left' : 'right'));

const init = () => {
  if (!props.options) {
    return;
  }
  let _files = getTemplate(props.options.appType || '') as Record<
    string,
    string
  >;
  if (props.options.serializedState) {
    _files = JSON.parse(atou(props.options.serializedState));
  } else if (props.options.initFiles) {
    _files = props.options.initFiles;
  }

  const files: Record<string, File> = {};
  for (const filename in _files) {
    files[filename] = new File(filename, _files[filename]);
  }

  store.files = files;

  for (let key in props.options) {
    if (key in store) {
      // @ts-ignore
      store[key] = props.options[key];
    }
  }

  if (!store.mainFile) {
    store.mainFile = Object.keys(files)[0];
  }
  store.activeFile = files[store.mainFile];

  if (props.options.imports) {
    store.files[MapFile] = new File(
      MapFile,
      JSON.stringify({ imports: props.options.imports }, null, 2)
    );
  }
};

watch(
  () => props.options,
  () => {
    init();
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div
    class="code-sandbox-container"
    :style="{
      height: props.options?.height ? `${props.options?.height}px` : '',
    }"
  >
    <Toolbar v-if="store.showToolbar" />
    <div
      class="main-content"
      :class="{ 'main-content-top': store.toolbarPosition === 'bottom' }"
    >
      <Splitter
        min="120px"
        max="300px"
        initSplit="130px"
        :showLeft="store.showFileBar"
      >
        <template #left>
          <FileBar />
        </template>
        <template #right>
          <Splitter
            min="0%"
            max="100%"
            :vertical="store.vertical"
            :showLeft="store.reverse ? store.showPreview : store.showCode"
            :showRight="store.reverse ? store.showCode : store.showPreview"
            :reverseID="store.reverseID"
          >
            <template #[CodeSlotName]>
              <CodeEditor />
            </template>
            <template #[PreviewSlotName]>
              <Preview />
            </template>
          </Splitter>
        </template>
      </Splitter>
    </div>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>
