import { fileTypes } from '@/constant';

export const getMode = (filename: string) => {
  return filename.endsWith('.vue') || filename.endsWith('.html')
    ? 'htmlmixed'
    : filename.endsWith('.css')
    ? 'css'
    : filename.endsWith('.jsx') || filename.endsWith('.tsx')
    ? 'javascript'
    : 'javascript';
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
