import { currentLanguage } from './tooltip';

type UITranslations = {
  Files: string;
  FileBar: string;
  CodeEditor: string;
  Preview: string;
  ReverseLayout: string;
  EditorFontSize: string;
  Theme: string;
  Light: string;
  Dark: string;
  Copied: string;
};

const uiTranslations: Record<'en' | 'zh', UITranslations> = {
  en: {
    Files: 'Files',
    FileBar: 'File Bar',
    CodeEditor: 'Code Editor',
    Preview: 'Preview',
    ReverseLayout: 'Reverse Layout',
    EditorFontSize: 'Editor Font Size',
    Theme: 'Theme',
    Light: 'Light',
    Dark: 'Dark',
    Copied: 'Copied',
  },
  zh: {
    Files: '文件',
    FileBar: '文件栏',
    CodeEditor: '代码编辑器',
    Preview: '预览区',
    ReverseLayout: '翻转布局',
    EditorFontSize: '编辑器字号',
    Theme: '主题',
    Light: '浅色',
    Dark: '深色',
    Copied: '已复制',
  },
};

const getUITranslations = () => uiTranslations[currentLanguage.value];

export const UIText = {
  get Files() {
    return getUITranslations().Files;
  },
  get FileBar() {
    return getUITranslations().FileBar;
  },
  get CodeEditor() {
    return getUITranslations().CodeEditor;
  },
  get Preview() {
    return getUITranslations().Preview;
  },
  get ReverseLayout() {
    return getUITranslations().ReverseLayout;
  },
  get EditorFontSize() {
    return getUITranslations().EditorFontSize;
  },
  get Theme() {
    return getUITranslations().Theme;
  },
  get Light() {
    return getUITranslations().Light;
  },
  get Dark() {
    return getUITranslations().Dark;
  },
  get Copied() {
    return getUITranslations().Copied;
  },
};
