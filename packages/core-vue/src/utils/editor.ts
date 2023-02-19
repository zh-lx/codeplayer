import { fileTypes } from '@/constant';
import { Compartment, Extension, StateEffect } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { vue } from '@codemirror/lang-vue';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { store } from '@/store';
import { materialLight } from '@ddietr/codemirror-themes/material-light';
import { materialDark } from '@ddietr/codemirror-themes/material-dark';
import { solarizedLight } from '@ddietr/codemirror-themes/solarized-light';
import { solarizedDark } from '@ddietr/codemirror-themes/solarized-dark';
import { dracula } from '@ddietr/codemirror-themes/dracula';
import { githubLight } from '@ddietr/codemirror-themes/github-light';
import { githubDark } from '@ddietr/codemirror-themes/github-dark';
import { aura } from '@ddietr/codemirror-themes/aura';
import { tokyoNight } from '@ddietr/codemirror-themes/tokyo-night';
import { tokyoNightStorm } from '@ddietr/codemirror-themes/tokyo-night-storm';
import { tokyoNightDay } from '@ddietr/codemirror-themes/tokyo-night-day';

const compartment = new Compartment();

export const configEditorExtensions = (
  view: EditorView,
  extensions: Extension
) => {
  if (compartment.get(view.state)) {
    // 重新配置插件
    view.dispatch({ effects: compartment.reconfigure(extensions) });
  } else {
    // 注入插件
    view.dispatch({
      effects: StateEffect.appendConfig.of(compartment.of(extensions)),
    });
  }
};

export const adaptExtensionsByFile = (view: EditorView, filename: string) => {
  let baseExtensions = [
    basicSetup,
    EditorView.updateListener.of((v) => {
      store.activeFile.code = v.state.doc.toString();
    }),
    githubLight,
  ];
  let extensions: any[] = [];

  switch (getMode(filename)) {
    case 'vue':
      extensions = [vue()];
      break;
    case 'html':
      extensions = [
        html({
          autoCloseTags: true,
          matchClosingTags: true,
          selfClosingTags: true,
        }),
      ];
      break;
    case 'css':
      extensions = [css()];
      break;
    case 'json':
      extensions = [json()];
      break;
    case 'javascript':
      extensions = [
        javascript({
          typescript: ['ts', 'tsx'].includes(getFilenameExt(filename)),
          jsx: ['jsx', 'tsx'].includes(getFilenameExt(filename)),
        }),
      ];
      break;
    default:
      break;
  }
  console.log(extensions);
  configEditorExtensions(view, [...baseExtensions, ...extensions]);
};

export const getMode = (filename: string) => {
  return filename.endsWith('.vue')
    ? 'vue'
    : filename.endsWith('.html')
    ? 'html'
    : filename.endsWith('.css')
    ? 'css'
    : filename.endsWith('.json')
    ? 'json'
    : filename.endsWith('.jsx') ||
      filename.endsWith('.tsx') ||
      filename.endsWith('.js') ||
      filename.endsWith('.ts')
    ? 'javascript'
    : 'javascript';
};

export const getFilenameExt = (filename: string) => {
  const segments = filename?.split('.');
  return segments?.[segments?.length - 1];
};

export const validateFile = (
  filename: string,
  files: Record<string, HTMLElement>
) => {
  // 校验是否为可解析文件
  if (!fileTypes.some((item) => filename.endsWith(item))) {
    window.alert(
      `Code Sandbox 当前仅支持 ${fileTypes
        .map((type) => `*${type}`)
        .join('、')} 类型的文件`
    );
    return false;
  }
  // 校验文件是否已存在
  if (files[filename]) {
    window.alert(`${filename}文件已存在！`);
    return false;
  }

  return true;
};
