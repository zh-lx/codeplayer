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
  showConsole: boolean;
  reverse: boolean;
  excludeTools: Control[];
  editor: any | null; // code Mirror 编辑器
  rerenderID: number; // 用于 preview 刷新的标识，当点击刷新按钮该值 +1 触发刷新
  codeSize: number;
  vueVersion: string;
  typescriptVersion: string;
  theme: Theme;
  reloadLanguageTools: () => void;
}

export const store = reactive<Store>({
  // 文件系统相关
  entry: 'index.html',
  files: {},
  activeFile: '',
  showFileBar: true,
  showCode: true,
  showPreview: true,
  showEruda: true,
  showConsole: false,
  reverse: false,
  excludeTools: [],
  editor: null,
  rerenderID: 0,
  codeSize: 14,
  vueVersion: '3.3.4',
  typescriptVersion: '4.9.3',
  theme: (localStorage.getItem(LocalThemeKey) as Theme) || 'light',
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
    const params = new URLSearchParams(location.search);
    params.set('files', utoa(JSON.stringify(fileMap)));
    const newURL = location.href.replace(
      location.search,
      '?' + params.toString()
    );
    history.pushState({ path: newURL }, '', newURL);
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
