import { reactive, watch } from 'vue';
import type { File } from '@/compiler';
import { type Editor } from 'codemirror';
import type { Control } from '@/type';
import { utoa } from '@//utils';
import { LocalThemeKey } from '@/constant';

export type Theme = 'light' | 'dark';
export interface Store {
  mainFile: string;
  activeFile: string;
  files: Record<string, File>;
  showFileBar: boolean;
  showCode: boolean;
  showPreview: boolean;
  reverse: boolean;
  excludeTools: Control[];
  imports: Record<string, string>;
  editor: Editor | null; // code Mirror 编辑器
  rerenderID: number; // 用于 preview 刷新的标识，当点击刷新按钮该值 +1 触发刷新
  sharePath: string; // 分享按钮的路径
  codeSize: number;
  vueVersion: string;
  typescriptVersion: string;
  theme: Theme;
  reloadLanguageTools: () => void;
}

export const store = reactive<Store>({
  // 文件系统相关
  mainFile: '',
  files: {},
  activeFile: '',
  imports: {},
  showFileBar: true,
  showCode: true,
  showPreview: true,
  reverse: false,
  excludeTools: [],
  editor: null,
  rerenderID: 0,
  sharePath: 'https://codeplayer.cn/playground',
  codeSize: 14,
  vueVersion: '3.2.0',
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
    params.set('codeplayer_files', utoa(JSON.stringify(fileMap)));
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
