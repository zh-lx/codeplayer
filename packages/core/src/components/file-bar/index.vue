<script setup lang="ts">
import { ref, computed } from 'vue';
import { File } from '@/compiler';
import { store } from '@/store';
import { fileTypes } from '@/constant';
import AddFile from './icons/add-file.vue';
import FileInput from './file-input.vue';
import FileList from './file-list.vue';

const newFilename = ref('');
const originFilename = ref('');
const showNewFile = ref(false);

// 切换文件
const changeActiveFile = (filename: string) => {
  store.activeFile = filename;
};

// 处理(新增/更改)文件
const changeFile = (newFilename: string, oldFilename: string) => {
  if (!oldFilename) {
    // add a new file
    const file = new File(newFilename, '');
    store.files[newFilename] = file;
    changeActiveFile(newFilename);
    if (!store.mainFile) {
      store.mainFile = newFilename;
    }
  } else {
    // rename filename
    const tempFiles = {
      ...store.files,
      [newFilename]: { ...store.files[oldFilename], filename: newFilename },
    };
    delete tempFiles[oldFilename];
    store.files = tempFiles;
    changeActiveFile(newFilename);
    if (oldFilename === store.mainFile) {
      store.mainFile = newFilename;
    }
  }
};

// 文件名编辑完成
const handleFilenameChange = () => {
  if (validateFilenameError(newFilename.value) === null) {
    changeFile(newFilename.value, originFilename.value);
  }
  newFilename.value = '';
  originFilename.value = '';
  showNewFile.value = false;
};

// 点击重命名文件
const handleEditFilename = (_originFilename?: string) => {
  originFilename.value = _originFilename || '';
  newFilename.value = originFilename.value;
  showNewFile.value = true;
};

// 处理文件 key down
const handleFilenameKeyDown = ({ key, target }: KeyboardEvent) => {
  if (key === 'Enter') {
    (target as HTMLInputElement).blur();
  }
};

// 校验文件名是否合法
const validateFilenameError = (filename: string) => {
  if (!filename || filename === originFilename.value) {
    return '';
  }
  if (store.files[filename]) {
    return `已存在同名文件 ${filename}`;
  }
  return null;
};

const newFileError = computed(() => {
  return validateFilenameError(newFilename.value);
});
</script>

<template>
  <div :class="`codeplayer-files-container`">
    <div class="files-container">
      <div class="files-head">
        <div class="files-head-left">Files</div>
        <div class="files-head-right">
          <AddFile @click="() => handleEditFilename()" />
        </div>
      </div>
      <!-- 新增文件输入框: -->
      <FileInput
        :show="showNewFile && !originFilename"
        :error="newFileError"
        v-model="newFilename"
        @handleBlur="handleFilenameChange"
        @handleKeyDown="handleFilenameKeyDown"
      />
      <FileList
        :originFilename="originFilename"
        :error="newFileError"
        @changeActiveFile="changeActiveFile"
        @handleClickRename="handleEditFilename"
        @handleFilenameChange="handleFilenameChange"
        @handleFilenameKeyDown="handleFilenameKeyDown"
        v-model:modelValue="newFilename"
      />
      <!-- <div class="files-list">${this.renderFileList()}</div> -->
    </div>
  </div>
</template>

<style scoped lang="less">
.codeplayer-files-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  height: 100%;
  font-family: @font-family;
  background-color: var(--codeplayer-filebar-bgc);
  .files-container {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    .files-head {
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px;
      color: var(--codeplayer-text-secondary);
      font-weight: 500;
      font-size: 12px;
      user-select: none;
      .files-head-left {
        font-size: @font-size-default;
        line-height: 20px;
      }
      .files-head-right {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
