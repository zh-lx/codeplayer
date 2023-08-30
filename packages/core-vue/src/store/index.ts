import { reactive } from 'vue';
import type { File } from '@/compiler';
import { type Editor } from 'codemirror';
import type { ToolbarPosition, Control } from '@/type';
import { FileSystem } from '@/compiler/file-system';
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
  editor: Editor | null; // code Mirror 编辑器
  rerenderID: number; // 用于 preview 刷新的标识，当点击刷新按钮该值 +1 触发刷新
  sharePath: string; // 分享按钮的路径
  codeSize: number;
}

export const store = reactive<Store>({
  // 文件系统相关
  mainFile: '',
  files: {},
  activeFile: {
    filename: '',
    code: '',
    compiled: { js: '', css: '' },
  },
  imports: {},
  showFileBar: true,
  showCode: true,
  showPreview: true,
  showToolbar: true,
  toolbarPosition: 'top',
  vertical: false,
  reverse: false,
  excludeTools: [],
  editor: null,
  rerenderID: 0,
  sharePath: 'https://code-sandbox.cn/playground',
  codeSize: 12,
});

export const fileStore = reactive<FileSystem>({
  files: {},
  mainFile: '',
  activeFile: {
    filename: '',
    code: '',
    compiled: { js: '', css: '' },
  },
  imports: {},
});
