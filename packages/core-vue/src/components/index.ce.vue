<script setup lang="ts">
import { defineProps, watch, computed } from 'vue';
import { fileStore, store } from '@/store';
import { MapFile } from '@/constant';
import { atou } from '@/utils';
import { getTemplate, File } from '@/compiler';
import { CodeSandboxOptions } from '@/type';
import Toolbar from './toolbar/index.vue';
import Splitter from './splitter/index.vue';
import FileBar from './file-bar/index.vue';
import CodeEditor from './code-editor/index.vue';
import Preview from './preview/index.vue';

const props = defineProps<{ options?: CodeSandboxOptions }>();

const CodeSlotName = computed(() => (store.reverse ? 'right' : 'left'));
const PreviewSlotName = computed(() => (store.reverse ? 'left' : 'right'));

const init = () => {
  const options = props.options || {};
  for (let key in props.options) {
    if (key in store && options[key as keyof typeof options] !== undefined) {
      // @ts-ignore
      store[key] = options[key];
    }
  }

  initFileSystem();
};

// 初始化文件系統
function initFileSystem() {
  // 依次根据 options.initFiles、serializedState、appType 初始化文件
  const options = props.options || {};
  let filesMap = getTemplate(options.appType || '') as Record<string, string>;
  if (options.serializedState) {
    filesMap = JSON.parse(atou(options.serializedState));
  } else if (options.initFiles) {
    filesMap = options.initFiles;
  }

  // 将键值对转换为虚拟文件
  const files: Record<string, File> = {};
  for (const filename in filesMap) {
    files[filename] = new File(filename, filesMap[filename]);
  }
  fileStore.files = files;

  // 初始化入口文件
  fileStore.mainFile = options.mainFile || '';
  if (!files[fileStore.mainFile]) {
    fileStore.mainFile = Object.keys(files)[0];
  }
  fileStore.activeFile = files[fileStore.mainFile];

  // 初始化 imports
  if (options.imports) {
    fileStore.files[MapFile] = new File(
      MapFile,
      JSON.stringify({ imports: options.imports }, null, 2)
    );
  }
}

watch(
  () => props.options,
  () => {
    init();
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <component is="style">{{ props.options?.css || '' }}</component>
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
            :fixedHeight="props.options?.height"
            :vertical="store.vertical"
            :showLeft="store.reverse ? store.showPreview : store.showCode"
            :showRight="store.reverse ? store.showCode : store.showPreview"
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
@import 'codemirror/lib/codemirror.css';
@import 'codemirror/addon/fold/foldgutter.css';
</style>
