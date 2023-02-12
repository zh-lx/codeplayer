import { reactive } from 'vue';
import type { File } from '@/utils';
import { type Editor } from 'codemirror';
import type { ToolbarPosition, AppType, Control } from '../main';

export interface Store {
  mainFile: string;
  activeFile: File;
  files: Record<string, File>;
  showFileBar: boolean;
  showCode: boolean;
  showPreview: boolean;
  showToolbar: boolean;
  toolbarPosition: ToolbarPosition;
  vertical: boolean;
  reverse: boolean;
  appType: AppType;
  initFiles: Record<string, File>;
  excludeTools: Control[];
  imports: Record<string, string>;
  serializedState: string;
  editor: Editor | null;
  refreshID: number; // 用于 preview 刷新的标识，当点击刷新按钮该值 +1 触发刷新
  reverseID: number; // code 和 preview 交换的标识
  sharePath: string;
}

export const store = reactive<Store>({
  mainFile: '',
  files: {},
  activeFile: {
    filename: '',
    code: '',
    hidden: false,
    compiled: { js: '', css: '' },
  },
  showFileBar: true,
  showCode: true,
  showPreview: true,
  showToolbar: true,
  toolbarPosition: 'top',
  vertical: false,
  reverse: false,
  appType: 'vue3',
  initFiles: {},
  excludeTools: [],
  imports: {},
  serializedState: '',
  editor: null,
  refreshID: 0,
  reverseID: 0,
  sharePath: 'https://code-sandbox.cn/playground',
});
