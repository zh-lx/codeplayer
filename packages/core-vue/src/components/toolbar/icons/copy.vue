<script lang="ts" setup>
import { store } from '@/store';
import { TooltipText } from '@/constant';
import { message } from '@/utils';

function copyCode() {
  try {
    const code = store.editor?.getValue() || '';
    navigator.clipboard.writeText(code);
    message('代码已复制至剪切板', { type: 'success' });
  } catch (error) {
    message('复制失败: ' + String(error), { type: 'danger' });
  }
}
</script>

<template>
  <div
    v-if="!store.excludeTools.includes('copy')"
    data-toggle="tooltip"
    :title="TooltipText.CopyCode"
    @click="copyCode"
    class="toolbar-icon"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="15"
    >
      <path
        fill="currentColor"
        d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z"
      />
    </svg>
  </div>
</template>
