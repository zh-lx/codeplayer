import { reactive } from 'vue';
import type { File } from '@/utils';

export interface FileSystem {
  files: Record<string, File>;
  mainFile: string;
  activeFile: File;
  imports: Record<string, string>;
}

export const fileStore = reactive<FileSystem>({
  files: {},
  mainFile: '',
  activeFile: {
    filename: '',
    code: '',
    hidden: false,
    compiled: { js: '', css: '' },
  },
  imports: {},
});
