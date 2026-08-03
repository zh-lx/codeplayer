import { ref } from 'vue';

export type Language = 'en' | 'zh';

export const LocalLanguageKey = 'codeplayer_local_language_key';

const languageFromStorage =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem(LocalLanguageKey)
    : null;

export const currentLanguage = ref<Language>(
  languageFromStorage === 'zh' ? 'zh' : 'en',
);

type TooltipTranslations = {
  AddFile: string;
  RenameFile: string;
  DeleteFile: string;
  isEntry: string;
  SetEntry: string;
  ToggleFiles: (show: boolean) => string;
  ToggleCode: (show: boolean) => string;
  Settings: string;
  ToggleWebPreview: (show: boolean) => string;
  RefreshWebPreview: string;
  SwapLayout: string;
  CopyCode: string;
  Share: string;
  Docs: string;
  Github: string;
  CopyLink: string;
  CopyFailed: string;
  ToggleLanguage: string;
};

const tooltipTranslations: Record<Language, TooltipTranslations> = {
  en: {
    AddFile: 'Add a new file',
    RenameFile: 'Rename',
    DeleteFile: 'Delete',
    isEntry: 'Entry File',
    SetEntry: 'Set to entry',
    ToggleFiles: (show) => `${show ? 'Hide' : 'Show'} FileBar`,
    ToggleCode: (show) => `${show ? 'Hide' : 'Show'} Code Editor`,
    Settings: 'Settings',
    ToggleWebPreview: (show) => `${show ? 'Hide' : 'Show'} Web Preview`,
    RefreshWebPreview: 'Refresh Web Preview',
    SwapLayout: 'Swap the position of CodeEditor and WebPreview',
    CopyCode: 'Copy code to clipboard',
    Share: 'Share the page',
    Docs: 'View documents',
    Github: 'Go to github',
    CopyLink: 'The link has been copied to the clipboard',
    CopyFailed: 'Copy Failed',
    ToggleLanguage: 'Switch to Chinese',
  },
  zh: {
    AddFile: '新建文件',
    RenameFile: '重命名',
    DeleteFile: '删除',
    isEntry: '入口文件',
    SetEntry: '设为入口文件',
    ToggleFiles: (show) => `${show ? '隐藏' : '显示'}文件栏`,
    ToggleCode: (show) => `${show ? '隐藏' : '显示'}代码编辑器`,
    Settings: '设置',
    ToggleWebPreview: (show) => `${show ? '隐藏' : '显示'}预览区`,
    RefreshWebPreview: '刷新预览区',
    SwapLayout: '交换代码编辑器和预览区的位置',
    CopyCode: '复制代码到剪贴板',
    Share: '分享页面',
    Docs: '查看文档',
    Github: '跳转至 GitHub',
    CopyLink: '链接已复制到剪贴板',
    CopyFailed: '复制失败',
    ToggleLanguage: '切换为英文',
  },
};

const getTooltipTranslations = () => tooltipTranslations[currentLanguage.value];

export const TooltipText = {
  get AddFile() {
    return getTooltipTranslations().AddFile;
  },
  get RenameFile() {
    return getTooltipTranslations().RenameFile;
  },
  get DeleteFile() {
    return getTooltipTranslations().DeleteFile;
  },
  get isEntry() {
    return getTooltipTranslations().isEntry;
  },
  get SetEntry() {
    return getTooltipTranslations().SetEntry;
  },
  ToggleFiles: (show: boolean) => getTooltipTranslations().ToggleFiles(show),
  ToggleCode: (show: boolean) => getTooltipTranslations().ToggleCode(show),
  get Settings() {
    return getTooltipTranslations().Settings;
  },
  ToggleWebPreview: (show: boolean) =>
    getTooltipTranslations().ToggleWebPreview(show),
  get RefreshWebPreview() {
    return getTooltipTranslations().RefreshWebPreview;
  },
  get SwapLayout() {
    return getTooltipTranslations().SwapLayout;
  },
  get CopyCode() {
    return getTooltipTranslations().CopyCode;
  },
  get Share() {
    return getTooltipTranslations().Share;
  },
  get Docs() {
    return getTooltipTranslations().Docs;
  },
  get Github() {
    return getTooltipTranslations().Github;
  },
  get CopyLink() {
    return getTooltipTranslations().CopyLink;
  },
  get CopyFailed() {
    return getTooltipTranslations().CopyFailed;
  },
  get ToggleLanguage() {
    return getTooltipTranslations().ToggleLanguage;
  },
};

export function setLanguage(language: Language) {
  currentLanguage.value = language;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LocalLanguageKey, language);
  }
}

export function toggleLanguage() {
  setLanguage(currentLanguage.value === 'en' ? 'zh' : 'en');
}
