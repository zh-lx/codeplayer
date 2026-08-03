import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { store } from '@/store';

export function useTooltip(
  reference: Ref<HTMLElement | null | undefined>,
  getContent: () => string
) {
  const content = computed(getContent);
  let instance: Instance<Props> | undefined;

  onMounted(() => {
    if (!reference.value) {
      return;
    }

    instance = tippy(reference.value, {
      content: content.value,
      placement: 'bottom',
      arrow: false,
      theme: store.theme === 'dark' ? '' : 'light',
    }) as unknown as Instance<Props>;
  });

  watch([content, () => store.theme], () => {
    if (!instance) {
      return;
    }

    instance.setContent(content.value);
    instance.setProps({
      theme: store.theme === 'dark' ? '' : 'light',
    });
  });

  onBeforeUnmount(() => {
    instance?.destroy();
  });
}
