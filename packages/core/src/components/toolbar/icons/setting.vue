<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import tippy from 'tippy.js';
import { store, Theme } from '@/store';
import { TooltipText, CodeSizes } from '@/constant';
import RightMenu, { activeClass } from '@/components/menus';

const settingDOM = ref();

onMounted(() => {
  initSettingMenu();
  watch(
    () => store.theme,
    () => {
      tippy(settingDOM.value, {
        content: TooltipText.Settings,
        placement: 'bottom',
        arrow: false,
        theme: store.theme === 'dark' ? 'light' : '',
      });
    },
    { immediate: true }
  );
});

const initSettingMenu = () => {
  new RightMenu(
    {
      el: settingDOM.value as HTMLElement,
      mode: 'click',
      theme: 'mac',
      minWidth: '100px',
    },
    () => [
      {
        type: 'ul',
        text: '外观',
        children: [
          {
            type: 'li',
            text: `文件栏`,
            class: store.showFileBar ? activeClass : '',
            callback: () => (store.showFileBar = !store.showFileBar),
            arrow: true,
          },
          {
            type: 'li',
            text: `代码编辑器`,
            class: store.showCode ? activeClass : '',
            callback: () => (store.showCode = !store.showCode),
            arrow: true,
          },
          {
            type: 'li',
            text: `预览区`,
            class: store.showPreview ? activeClass : '',
            callback: () => (store.showPreview = !store.showPreview),
            arrow: true,
          },
          {
            type: 'li',
            text: '翻转布局',
            class: !store.reverse ? '' : activeClass,
            callback: () => (store.reverse = !store.reverse),
            arrow: true,
          },
          { type: 'hr' },
          {
            type: 'ul',
            text: '编辑器字号',
            children: CodeSizes.map((size) => ({
              type: 'li',
              text: `${size} px`,
              class: store.codeSize === size ? activeClass : '',
              callback: () => (store.codeSize = size),
              uniqueActive: true,
            })),
          },
          {
            type: 'ul',
            text: '主题',
            children: ['light', 'dark'].map((theme) => ({
              type: 'li',
              text: theme,
              class: store.theme === theme ? activeClass : '',
              callback: () => (store.theme = theme as Theme),
              uniqueActive: true,
            })),
          },
        ],
      },
    ]
  );
};
</script>

<template>
  <div class="toolbar-icon" ref="settingDOM">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="M8 4H21V6H8V4ZM3 3.5H6V6.5H3V3.5ZM3 10.5H6V13.5H3V10.5ZM3 17.5H6V20.5H3V17.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"
      ></path>
    </svg>
  </div>
</template>
<style scoped lang="less">
@import './icon.less';
</style>

<style lang="less">
@import '@/style/variable.less';
@import '@/style/index.less';
/**
 * 基础样式
 */
.code-player-right-menu-list {
  width: auto;
  z-index: 9999;
  position: fixed;
  display: block;
  box-sizing: border-box;
  user-select: none;
  li {
    display: block;
    list-style: none;
    cursor: default;
    // 文本溢出隐藏
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    &.skeleton {
      &::before {
        content: '.';
        display: inline-block;
        width: 100%;
        border-radius: 3px;
        background-image: linear-gradient(-45deg, #ccc 40%, #fff 55%, #ccc 63%);
        background-size: 400% auto;
        background-repeat: no-repeat;
        position: relative;
        color: transparent;
        animation: skeleton-animation 2s ease infinite;
      }
      &:hover {
        color: transparent;
        background-color: transparent;
      }
    }
    &.menu-hr {
      height: 0;
      border-bottom: 1px solid @border-color;
      &:hover {
        background-color: transparent !important;
      }
    }
    &.menu-ul::after {
      content: '▸';
      width: 15px;
      height: 15px;
      position: absolute;
      right: 0px;
    }
  }
}

@keyframes skeleton-animation {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

/**
 * mac主题色
 */
.code-player-theme-mac {
  min-width: 180px;
  max-width: 300px;
  color: @text-color;
  font-size: 13px;
  margin: 0;
  padding: 5px 4px;
  border: 0.5px solid @border-color;
  border-radius: 5px;
  background-color: @fill-gray-float;
  box-shadow: @shadow-1-down;
  li {
    padding: 2.5px 26px 2.5px 8px;
    border-radius: 3px;
    &:hover {
      color: @text-color-white;
      background-color: @brand;
      cursor: pointer;
    }
    &.skeleton {
      padding: 2.5px 8px;
      &::before {
        background-image: linear-gradient(
          -45deg,
          #4c4c4f 40%,
          #444 55%,
          #4c4c4f 63%
        );
      }
    }
    &.menu-hr {
      border-bottom: 1px solid @border-color-hover;
      padding: 0;
      margin: 5px 8px;
    }
    &.menu-disabled {
      color: @text-color-disable;
      &:hover {
        color: @text-color-disable;
        background-color: @fill-gray-float;
      }
    }
  }
  .code-player-active-menu-item {
    color: @brand;
    &:active {
      background-color: @brand-active;
    }
  }
  .code-player-not-active-menu-item {
    color: @text-color;
  }
}
</style>
