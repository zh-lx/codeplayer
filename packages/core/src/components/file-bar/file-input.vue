<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  withDefaults,
  ref,
  Ref,
  watch,
  nextTick,
} from 'vue';
const props = withDefaults(
  defineProps<{
    show: boolean;
    modelValue: string;
    error: string | null;
  }>(),
  {
    show: false,
    modelValue: '',
    error: null,
  }
);

const emit = defineEmits(['update:modelValue', 'handleKeyDown', 'handleBlur']);
const fileInputDOM = ref<HTMLInputElement>() as Ref<HTMLInputElement>;

watch(
  () => props.show,
  (val) => {
    if (val) {
      nextTick(() => {
        fileInputDOM.value.focus();
      });
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="new-file-container" v-show="props.show">
    <input
      id="new-filename-input"
      class="new-file-input"
      :value="props.modelValue"
      @input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      @keydown="(e) => emit('handleKeyDown', e)"
      @blur="() => emit('handleBlur')"
      ref="fileInputDOM"
    />
    <div class="new-file-error" v-show="props.error">
      {{ props.error }}
    </div>
  </div>
</template>
