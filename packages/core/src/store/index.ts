import { reactive, watch } from 'vue';
import type { File } from '@/compiler';
import type { Control } from '@/type';
import { utoa } from '@//utils';
import { LocalThemeKey } from '@/constant';

export type Theme = 'light' | 'dark';
export interface Store {
  entry: string;
  activeFile: string;
  files: Record<string, File>;
  showFileBar: boolean;
  showCode: boolean;
  showPreview: boolean;
  showEruda: boolean;
  openConsole: boolean;
  reverse: boolean;
  excludeTools: Control[];
  editor: any | null; // code Mirror 编辑器
  rerenderID: number; // 用于 preview 刷新的标识，当点击刷新按钮该值 +1 触发刷新
  codeSize: number;
  vueVersion: 2 | 3;
  typescriptVersion: string;
  theme: Theme;
  reloadLanguageTools: () => void;
}

const params = new URLSearchParams(location.search);

export const store = reactive<Store>({
  // 文件系统相关
  entry: decodeURIComponent(params.get('params') || 'index.html'),
  files: {},
  activeFile: decodeURIComponent(params.get('activeFile') || ''),
  showFileBar: params.get('showFileBar') !== 'false',
  showCode: params.get('showCode') !== 'false',
  showPreview: params.get('showPreview') !== 'false',
  showEruda: params.get('showEruda') !== 'false',
  openConsole: params.get('openConsole') === 'true',
  reverse: params.get('reverse') === 'true',
  excludeTools:
    JSON.parse(decodeURIComponent(params.get('excludeTools') || '[]')) || [],
  editor: null,
  rerenderID: 0,
  codeSize: Number(params.get('codeSize') || 14),
  vueVersion: Number(params.get('vueVersion') || 3) as 2 | 3,
  typescriptVersion: '4.9.3',
  theme:
    (params.get('theme') as Theme) ||
    (localStorage.getItem(LocalThemeKey) as Theme) ||
    'light',
  reloadLanguageTools: () => {},
});

watch(
  () => store.files,
  (val) => {
    if (!val) {
      return;
    }
    const fileMap: Record<string, string> = {};
    for (let key in store.files) {
      fileMap[key] = store.files[key].code;
    }
    location.hash = utoa(JSON.stringify(fileMap));
  },
  { deep: true }
);

watch(
  () => store.theme,
  (val) => {
    document.body.className = `codeplayer-theme-${val}`;
  },
  { immediate: true }
);

function syncStoreToUrl(keys: string[]) {
  for (let key of keys) {
    watch(
      () => store[key as keyof typeof store],
      (val) => {
        if (val !== undefined) {
          const url = new URL(location.href);
          if (typeof val === 'object') {
            url.searchParams.set(key, encodeURIComponent(JSON.stringify(val)));
          } else {
            url.searchParams.set(key, val);
          }
          history.pushState({}, '', url);
        }
      },
      { deep: true }
    );
  }
}

syncStoreToUrl([
  'entry',
  'activeFile',
  'showFileBar',
  'showCode',
  'showPreview',
  'showEruda',
  'openConsole',
  'reverse',
  'excludeTools',
  'codeSize',
  'theme',
]);
