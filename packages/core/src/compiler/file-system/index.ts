import {
  HtmlTemplate,
  JsTemplate,
  ReactTemplate,
  TsTemplate,
  Vue3Template,
  Vue2Template,
} from '@/templates';
import { File } from '@/compiler/type';

export interface FileSystem {
  // 全部文件
  files: Record<string, File>;
  // 入口文件
  entry: string;
  // 当前编辑中的文件
  activeFile: string;
  // imports map
  imports: Record<string, string>;
}

export const getTemplate = (appType: string = 'vue3') => {
  if (appType === 'vue3' || appType === 'vue') {
    return Vue3Template;
  } else if (appType === 'vue2') {
    return Vue2Template;
  } else if (appType === 'react') {
    return ReactTemplate;
  } else if (appType === 'html') {
    return HtmlTemplate;
  } else if (appType === 'javascript' || 'js') {
    return JsTemplate;
  } else {
    return TsTemplate;
  }
};

export const getFileExtraName = (filename: string) => {
  const segments = filename?.split('.');
  return segments[segments.length - 1];
};

export const getFileLanguage = (filename: string) => {
  const ext = getFileExtraName(filename);
  if (ext === 'js' || ext === 'jsx') {
    return 'javascript';
  } else if (ext === 'ts' || ext === 'tsx') {
    return 'typescript';
  } else if (['css', 'less', 'sass', 'scss'].includes(ext)) {
    return 'css';
  } else {
    return ext;
  }
};
