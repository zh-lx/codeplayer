<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { store, Theme } from '@/store';
import { TooltipText, CodeSizes, LocalThemeKey } from '@/constant';
import RightMenu, { activeClass } from '@/components/menus';

const settingDOM = ref();
let tippyDOM: Instance<Props> | undefined;

onMounted(() => {
  initSettingMenu();
  watch(
    () => store.theme,
    () => {
      if (tippyDOM) {
        tippyDOM.destroy();
      }
      tippyDOM = tippy(settingDOM.value, {
        content: TooltipText.Settings,
        placement: 'bottom',
        arrow: false,
        theme: store.theme === 'dark' ? '' : 'light',
      }) as unknown as Instance<Props>;
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
          callback: () => {
            (store.theme = theme as Theme),
              localStorage.setItem(LocalThemeKey, theme);
          },
          uniqueActive: true,
        })),
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
      width="18"
      height="18"
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
.codeplayer-right-menu-list {
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
        background-image: #fff;
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
      content: '＞';
      width: 16px;
      height: 16px;
      transform: translateX(10px);
    }
    &.arrow-active-item::after {
      content: '✓';
      width: 16px;
      height: 16px;
      transform: translateX(10px);
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
.codeplayer-theme-mac {
  color: var(--codeplayer-menu-color);
  font-size: 13px;
  margin: 0;
  padding: 5px 4px;
  border-radius: 5px;
  background-color: var(--codeplayer-float-bgc);
  box-shadow: var(--codeplayer-menu-shadow);
  li {
    padding: 2.5px 20px 2.5px 20px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 3px;
    &:hover {
      color: @text-color-white;
      background-color: @brand;
      cursor: pointer;
    }
    &.skeleton {
      padding: 2.5px 8px;
    }
    &.menu-hr {
      border-bottom: 1px solid @border-color-hover;
      padding: 0;
      width: 100%;
      margin: 5px 0px;
    }
    &.menu-disabled {
      color: @text-color-disable;
      &:hover {
        color: @text-color-disable;
        background-color: @fill-gray-float;
      }
    }
  }
  .codeplayer-active-menu-item {
    color: @brand;
    &:active {
      background-color: @brand-active;
    }
  }
  .codeplayer-not-active-menu-item {
    color: var(--codeplayer-menu-color);
  }
}
</style>
