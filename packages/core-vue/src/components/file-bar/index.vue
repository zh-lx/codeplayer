<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import { File } from '@/utils';
import { store } from '@/store';
import { MapFile, fileTypes, TooltipText } from '@/constant';
import AddFile from './icons/add-file.vue';
import FileInput from './file-input.vue';
import FileList from './file-list.vue';

const newFilename = ref('');
const originFilename = ref('');
const showNewFile = ref(false);

// 切换文件
const changeActiveFile = (filename: string) => {
  store.activeFile = store.files[filename];
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

// 删除文件
const deleteFile = (filename: string) => {
  // Todo: 确认删除框样式优化
  if (confirm(`确定要删除 ${filename} 吗?`)) {
    if (store.activeFile.filename === filename) {
      store.activeFile = store.files[store.mainFile];
    }
    const tempFiles = { ...store.files };
    delete tempFiles[filename];
    store.files = tempFiles;
  }
};

// 重新设置入口文件
const resetEntryFile = (filename: string) => {
  // Todo: 确认删除框样式优化
  if (confirm(`是否要将入口文件修改为 ${filename}?`)) {
    store.mainFile = filename;
    store.activeFile = store.files[filename];
  }
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
  const fileType = fileTypes.some((type) => filename.endsWith(type));
  if (!fileType) {
    return `CodeSandbox 当前只支持 ${fileTypes
      .map((type) => `*${type}`)
      .join('、')} 类型的文件`;
  }
  return null;
};

const newFileError = computed(() => {
  return validateFilenameError(newFilename.value);
});
</script>

<template>
  <div class="code-sandbox-files-container">
    <div class="files-container">
      <div class="files-head">
        <div class="files-head-left">FILES</div>
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
