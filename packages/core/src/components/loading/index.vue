<template>
  <div class="loading-container">
    <div class="loader-icon">
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg
        t="1694085836056"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5581"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="120"
        height="120"
      >
        <path
          d="M896 128H128c-35.2 0-64 28.8-64 64v640c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64z m32 704c0 19.2-12.8 32-32 32H128c-19.2 0-32-12.8-32-32V320h832v512z m0-544H96v-96c0-19.2 12.8-32 32-32h768c19.2 0 32 12.8 32 32v96z"
          fill="#34495E"
          p-id="5582"
        ></path>
        <path
          d="M416 224m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
          fill="#00B42A"
          p-id="5583"
        ></path>
        <path
          d="M288 224m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
          fill="#F7BA1E"
          p-id="5584"
        ></path>
        <path
          d="M160 224m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
          fill="#F53F3F"
          p-id="5585"
        ></path>
        <path
          d="M446.784 757.28l99.568-370.832 30.896 8.288-99.568 370.848zM405.04 711.776L269.248 576l135.776-135.76-22.656-22.64L224 576l158.4 158.4zM618.96 711.776l22.672 22.624L800 576l-158.4-158.4-22.64 22.608L754.752 576z"
          p-id="5586"
          fill="none"
          stroke="#006AFF"
          stroke-width="16"
          stroke-dasharray="60"
          stroke-dashoffset="60"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="60;0"
            dur="4s"
            keyTimes="0;1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            values="60;0"
            dur="4s"
            keyTimes="0;1"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
    <p class="loading-text">{{ msg }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const msg = ref('资源加载中');

let timer: any;
const startTime = Date.now();

function loadingMsg() {
  requestAnimationFrame(() => {
    const now = Date.now();
    const nowNum = Math.floor((now - startTime) / 500);
    msg.value = '资源加载中' + '.'.repeat(nowNum % 4);
    loadingMsg();
  });
}

onMounted(() => {
  loadingMsg();
});
</script>

<style scoped lang="less">
.loading-container {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .loader-icon {
    width: 120px;
    height: 120px;
  }
  .loading-text {
    color: #333;
  }
}
</style>
