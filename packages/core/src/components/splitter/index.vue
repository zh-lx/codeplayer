<script setup lang="ts">
import { ref, Ref, watch, onMounted, nextTick, toRaw } from 'vue';
import { convertToNumber } from '@/utils';
import { store } from '@/store';

const props = withDefaults(
  defineProps<{
    min?: string;
    max?: string;
    initSplit?: string;
    showLeft?: boolean;
    showRight?: boolean;
    fixedHeight?: number;
  }>(),
  {
    min: '0%',
    max: '100%',
    initSplit: '50%',
    showLeft: true,
    showRight: true,
  }
);

const split = ref('50%'); // 左侧所占百分比
const isDrag = ref(false);
const startPosition = ref(0);
const startSplit = ref(0);
const startHeight = ref(0);
const showMask = ref(false);
const leftDOM = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const rightDOM = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const splitterDOM = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const draggerDOM = ref<HTMLDivElement>() as Ref<HTMLDivElement>;

onMounted(() => {
  nextTick(() => {
    changeStyle();
  });
});

// 获取 container 总宽(高)度
const getContainerLength = () => {
  return splitterDOM.value.offsetWidth;
};

// 计算 left 的宽(高)度
const computedSplitBound = () => {
  const total = getContainerLength();
  const _min = convertToNumber(props.min, total);
  const _max = convertToNumber(props.max, total);
  const _split = convertToNumber(split.value, total);
  if (!props.showRight) {
    return total;
  }
  return _split < _min
    ? // split < min / 2 && this.closable ? 0:
      _min
    : _split > _max
    ? _max
    : _split;
};

const dragStart = (e: MouseEvent) => {
  isDrag.value = true;
  startPosition.value = e.pageX;
  startSplit.value = computedSplitBound();
  startHeight.value = leftDOM.value.getBoundingClientRect().height;
  splitterDOM.value.style.cursor = 'col-resize';
  draggerDOM.value.style.backgroundColor = 'var(--border-brand)';
  showMask.value = true;
};

const dragMove = (e: MouseEvent) => {
  if (isDrag.value) {
    const position = e.pageX;
    const dp = position - startPosition.value;
    split.value = String(startSplit.value + dp);
  }
};

const dragEnd = () => {
  isDrag.value = false;
  splitterDOM.value.style.cursor = 'initial';
  draggerDOM.value.style.backgroundColor = 'transparent';
  showMask.value = false;
  nextTick(() => {
    store.editor && toRaw(store.editor).refresh();
  });
};

const changeStyle = () => {
  leftDOM.value.style.height = '';
  leftDOM.value.style.width = computedSplitBound() + 'px';
  leftDOM.value.style.borderRight =
    computedSplitBound() && props.showRight
      ? '1px solid var(--border-color)'
      : 'none';
  leftDOM.value.style.borderBottom = 'none';
  leftDOM.value.style.display = props.showLeft ? 'block' : 'none';
  rightDOM.value.style.display = props.showRight ? 'block' : 'none';
};

watch(
  () => [split.value, props.showRight, props.showLeft],
  () => {
    if (!leftDOM.value) {
      // 还没 mount
      return;
    }
    changeStyle();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.initSplit,
  (val) => {
    split.value = val;
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="codeplayer-splitter"
    ref="splitterDOM"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div class="splitter-left" ref="leftDOM">
      <slot name="left" />
      <div ref="draggerDOM" :class="'dragger'" @mousedown="dragStart" />
      <div
        class="splitter-mask"
        :class="{ 'splitter-mask-hidden': !showMask }"
      />
    </div>
    <div class="splitter-right" ref="rightDOM">
      <slot name="right" />
      <div
        class="splitter-mask"
        :class="{ 'splitter-mask-hidden': !showMask }"
      />
    </div>
  </div>
</template>
