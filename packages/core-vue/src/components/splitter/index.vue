<script setup lang="ts">
import { ref, Ref, defineProps, withDefaults, watch, onMounted } from 'vue';
import { convertToNumber } from '@/utils';

const props = withDefaults(
  defineProps<{
    min?: string;
    max?: string;
    initSplit?: string;
    showLeft?: boolean;
    showRight?: boolean;
    reverseID?: number;
    vertical?: boolean;
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
  changeStyle();
});

// 左右交换所占比例
function swap() {
  // 锁定 splitterDOM 的高度
  const _split = (1 - computedSplitBound() / getContainerLength()) * 100 + '%';
  split.value = _split;
}

// 获取 container 总宽(高)度
const getContainerLength = (vertical?: boolean) => {
  return vertical || props.vertical
    ? splitterDOM.value.offsetHeight
    : splitterDOM.value.offsetWidth;
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
  startPosition.value = props.vertical ? e.pageY : e.pageX;
  startSplit.value = computedSplitBound();
  startHeight.value = leftDOM.value.getBoundingClientRect().height;
  splitterDOM.value.style.cursor = props.vertical ? 'row-resize' : 'col-resize';
  draggerDOM.value.style.backgroundColor = 'var(--border-brand)';
  showMask.value = true;
};

const dragMove = (e: MouseEvent) => {
  if (isDrag.value) {
    if (!props.vertical || props.fixedHeight !== undefined) {
      const position = props.vertical ? e.pageY : e.pageX;
      const dp = position - startPosition.value;
      split.value = String(startSplit.value + dp);
    } else {
      // 自由高度下，拖拽只调整前一个元素的高度比例，不调整 split
      const position = e.pageY;
      const dp = position - startPosition.value;
      leftDOM.value.style.height = startHeight.value + dp + 'px';
    }
  }
};

const dragEnd = () => {
  isDrag.value = false;
  splitterDOM.value.style.cursor = 'initial';
  draggerDOM.value.style.backgroundColor = 'transparent';
  showMask.value = false;
};

const changeStyle = () => {
  if (props.vertical) {
    if (props.fixedHeight !== undefined) {
      leftDOM.value.style.height = computedSplitBound() + 'px';
    }
    leftDOM.value.style.width = '100%';
    leftDOM.value.style.borderBottom =
      computedSplitBound() && props.showRight
        ? '1px solid var(--border-primary)'
        : 'none';
    leftDOM.value.style.borderRight = 'none';
  } else {
    leftDOM.value.style.height = '';
    leftDOM.value.style.width = computedSplitBound() + 'px';
    leftDOM.value.style.borderRight =
      computedSplitBound() && props.showRight
        ? '1px solid var(--border-primary)'
        : 'none';
    leftDOM.value.style.borderBottom = 'none';
  }
  leftDOM.value.style.display = props.showLeft ? 'block' : 'none';
  rightDOM.value.style.display = props.showRight ? 'block' : 'none';
};

watch(
  () => [split.value, props.showRight, props.showLeft, props.vertical],
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

watch(() => props.reverseID, swap);
</script>

<template>
  <div
    class="code-sandbox-splitter"
    :class="{ 'code-sandbox-splitter-vertical': props.vertical }"
    ref="splitterDOM"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div class="splitter-left" ref="leftDOM">
      <slot name="left" />
      <div
        ref="draggerDOM"
        :class="`${props.vertical ? 'vertical-dragger' : 'dragger'}`"
        @mousedown="dragStart"
      />
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
