<script setup lang="ts">
import { defineProps, watch, computed, withDefaults } from 'vue';
import { store } from '@/store';
import { MapFile } from '@/constant';
import { atou, getTemplate, File } from '@/utils';
import { type Control, ToolbarPosition } from '@/type';
import Toolbar from './toolbar/index.vue';
import Splitter from './splitter/index.vue';
import FileBar from './file-bar/index.vue';
import CodeEditor from './code-editor/index.vue';
import Preview from './preview/index.vue';

type Props = {
  height?: number;
  showFileBar?: boolean;
  showCode?: boolean;
  showPreview?: boolean;
  showToolbar?: boolean;
  mainFile?: string;
  initFiles?: Record<string, string>;
  imports?: Record<string, string>;
  appType?: 'vue' | 'vue3' | 'react' | 'html' | 'javascript' | 'typescript';
  excludeTools?: Control[];
  vertical?: boolean;
  reverse?: boolean;
  toolbarPosition?: ToolbarPosition;
  serializedState?: string;
  css?: string;
};

const props = withDefaults(defineProps<Props>(), {
  showFileBar: true,
  showCode: true,
  showPreview: true,
  showToolbar: true,
  appType: 'vue3',
});

const CodeSlotName = computed(() => (store.reverse ? 'right' : 'left'));
const PreviewSlotName = computed(() => (store.reverse ? 'left' : 'right'));

const init = () => {
  let _files = getTemplate(props.appType || '') as Record<string, string>;
  if (props.serializedState) {
    _files = JSON.parse(atou(props.serializedState));
  } else if (props.initFiles) {
    _files = props.initFiles;
  }

  const files: Record<string, File> = {};
  for (const filename in _files) {
    files[filename] = new File(filename, _files[filename]);
  }

  store.files = files;

  for (let key in props) {
    if (key in store && props[key as keyof Props] !== undefined) {
      // @ts-ignore
      store[key] = props[key];
    }
  }

  if (!store.mainFile) {
    store.mainFile = Object.keys(files)[0];
  }
  store.activeFile = files[store.mainFile];

  if (props.imports) {
    store.files[MapFile] = new File(
      MapFile,
      JSON.stringify({ imports: props.imports }, null, 2)
    );
  }
};

watch(
  () => props,
  () => {
    init();
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <component is="style">{{ props.css || '' }}</component>
  <div
    class="code-sandbox-container"
    :style="{
      height: props?.height ? `${props?.height}px` : '',
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
            <template v-slot:[CodeSlotName]>
              <CodeEditor />
            </template>
            <template v-slot:[PreviewSlotName]>
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
