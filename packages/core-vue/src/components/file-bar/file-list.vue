<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults } from 'vue';
import { fileStore, store } from '@/store';
import { MapFile } from '@/constant';
import FileInput from './file-input.vue';
import { file } from '@babel/types';
import JsSVG from '@/assets/js.svg';
import TsSVG from '@/assets/ts.svg';
import JsxSVG from '@/assets/jsx.svg';
import TsxSVG from '@/assets/tsx.svg';
import CssSVG from '@/assets/css.svg';
import HtmlSVG from '@/assets/html.svg';
import VueSVG from '@/assets/vue.svg';
import JsonSVG from '@/assets/json.svg';
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
  ...Object.keys(fileStore.files).filter((file) => file !== MapFile),
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
          'active-file-item': filename === fileStore.activeFile,
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
