import { reactive } from 'vue';
import type { File } from '@/utils';
import { type EditorView } from '@codemirror/view';
import type { ToolbarPosition, Control } from '@/type';

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
  excludeTools: Control[];
  imports: Record<string, string>;
  editor: EditorView | null; // code Mirror 编辑器
  refreshID: number; // 用于 preview 刷新的标识，当点击刷新按钮该值 +1 触发刷新
  sharePath: string; // 分享按钮的路径
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
  excludeTools: [],
  imports: {},
  editor: null,
  refreshID: 0,
  sharePath: 'https://code-sandbox.cn/playground',
});
