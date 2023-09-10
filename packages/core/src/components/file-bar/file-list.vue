<script setup lang="ts">
import { computed } from 'vue';
import { store } from '@/store';
import { MapFile } from '@/constant';
import FileInput from './file-input.vue';
import JsSVG from '@/assets/js.svg';
import TsSVG from '@/assets/ts.svg';
import JsxSVG from '@/assets/jsx.svg';
import TsxSVG from '@/assets/tsx.svg';
import CssSVG from '@/assets/css.svg';
import HtmlSVG from '@/assets/html.svg';
import VueSVG from '@/assets/vue.svg';
import JsonSVG from '@/assets/json.svg';
import LessSVG from '@/assets/less.svg';
import SassSVG from '@/assets/sass.svg';
import ScssSVG from '@/assets/scss.svg';
import DefaultFileSVG from '@/assets/default_file.svg';
import RenameFile from './icons/rename-file.vue';
import DeleteFile from './icons/delete-file.vue';
import HomeFile from './icons/home-file.vue';

const props = withDefaults(
  defineProps<{
    originFilename: string;
    error: string | null;
    modelValue: string;
  }>(),
  {
    originFilename: '',
    error: null,
    modelValue: '',
  }
);

const emit = defineEmits([
  'changeActiveFile',
  'handleClickRename',
  'update:modelValue',
  'handleFilenameChange',
  'handleFilenameKeyDown',
]);

const list = computed(() => [
  ...Object.keys(store.files).filter((file) => file !== MapFile),
  MapFile,
]);

const getIcon = (filename: string) => {
  const segments = filename?.split('.');
  const suffix = segments[segments.length - 1];
  if (suffix === 'js') {
    return JsSVG;
  } else if (suffix === 'ts') {
    return TsSVG;
  } else if (suffix === 'css') {
    return CssSVG;
  } else if (suffix === 'html') {
    return HtmlSVG;
  } else if (suffix === 'vue') {
    return VueSVG;
  } else if (suffix === 'jsx') {
    return JsxSVG;
  } else if (suffix === 'tsx') {
    return TsxSVG;
  } else if (suffix === 'json') {
    return JsonSVG;
  } else if (suffix === 'less') {
    return LessSVG;
  } else if (suffix === 'sass') {
    return SassSVG;
  } else if (suffix === 'scss') {
    return ScssSVG;
  } else {
    return DefaultFileSVG;
  }
};
</script>

<template>
  <div class="file-list">
    <div v-for="filename in list" :key="filename">
      <FileInput
        v-if="props.originFilename === filename"
        :show="props.originFilename === filename"
        :error="props.error"
        :modelValue="modelValue"
        @update:modelValue="(val) => emit('update:modelValue', val)"
        @handleBlur="() => emit('handleFilenameChange')"
        @handleKeyDown="(e) => emit('handleFilenameKeyDown', e)"
      />
      <div
        v-else
        class="file-item"
        :class="{
          'active-file-item': filename === store.activeFile,
        }"
        @click="() => emit('changeActiveFile', filename)"
      >
        <div class="file-left">
          <img class="file-item-icon" :src="getIcon(filename)" />
          <div class="file-item-name">{{ filename }}</div>
        </div>
        <div class="file-right" v-if="filename !== MapFile">
          <RenameFile @click="() => emit('handleClickRename', filename)" />
          <DeleteFile :filename="filename" />
          <HomeFile :filename="filename" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.file-list {
  flex: 1;
  overflow: auto;
  .file-item {
    font-size: 14px;
    line-height: 18px;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    user-select: none;
    .file-left {
      display: flex;
      align-items: center;
      flex: 1;
      overflow: hidden;
      .file-item-icon {
        height: 16px;
        width: 16px;
        object-fit: cover;
        margin-right: 2px;
      }
      .file-item-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        color: var(--brand);
      }
      &:active {
        color: var(--brand-active);
      }
    }
    .file-right {
      display: flex;
      align-items: center;
      color: var(--text-secondary);
      .file-option-button {
        display: none;
      }
    }
    &:hover {
      color: var(--brand);
      .file-right {
        .file-option-button {
          display: block;
        }
      }
    }
  }
  .active-file-item {
    background-color: var(--active-file-bgc);
    color: var(--brand);
  }
}
</style>
