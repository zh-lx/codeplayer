<script setup lang="ts">
import { watch, computed } from 'vue';
import { store } from '@/store';
import { atou } from '@/utils';
import { getTemplate, File } from '@/compiler';
import { CodePlayerOptions } from '@/type';
import Toolbar from './toolbar/index.vue';
import Splitter from './splitter/index.vue';
import FileBar from './file-bar/index.vue';
import CodeEditor from './monaco-editor/index.vue';
import Preview from './preview/index.vue';

const props = defineProps<{ options?: CodePlayerOptions }>();

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
  const params = new URLSearchParams(location.search);
  if (options.initFiles) {
    filesMap = options.initFiles;
  } else if (params.get('codeplayer_files')) {
    const files = JSON.parse(atou(params.get('codeplayer_files') as string));
    filesMap = files;
  }

  // 将键值对转换为虚拟文件
  const files: Record<string, File> = {};
  for (const filename in filesMap) {
    files[filename] = new File(filename, filesMap[filename]);
  }
  store.files = files;

  // 初始化入口文件
  store.mainFile = options.mainFile || '';
  if (!files[store.mainFile]) {
    store.mainFile = Object.keys(files)[0];
  }
  store.activeFile = options.activeFile || store.mainFile;
}

watch(
  () => props.options,
  () => {
    init();
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<template>
  <div
    class="code-player-container"
    :style="{
      height: props.options?.height ? `${props.options?.height}px` : '',
    }"
  >
    <Toolbar />
    <div class="main-content main-content-top">
      <Splitter
        min="140px"
        max="300px"
        initSplit="160px"
        :showLeft="store.showFileBar"
      >
        <template #left>
          <FileBar />
        </template>
        <template #right>
          <Splitter
            class="main-splitter"
            min="0%"
            max="100%"
            :fixedHeight="props.options?.height"
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

.code-player-container {
  width: 100vw;
  height: 100vh;
  color: var(--main-color);
}
</style>
