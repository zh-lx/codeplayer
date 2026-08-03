<script setup lang="ts">
import { ref } from 'vue';
import { currentLanguage, TooltipText, toggleLanguage } from '@/constant';
import { useTooltip } from '@/composables/use-tooltip';
import { store } from '@/store';

const reference = ref();

useTooltip(reference, () => TooltipText.ToggleLanguage);
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('language')"
    ref="reference"
    @click="toggleLanguage"
    class="toolbar-icon"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <g
        :class="
          currentLanguage === 'zh' ? 'language-primary' : 'language-tertiary'
        "
      >
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
      </g>
      <g
        :class="
          currentLanguage === 'en' ? 'language-primary' : 'language-tertiary'
        "
      >
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </g>
    </svg>
  </div>
</template>

<style scoped lang="less">
@import './icon.less';

.language-primary path {
  stroke: @text-color;
}

.language-tertiary path {
  stroke: @text-color-tertiary;
}
</style>
