export const getMode = (filename: string) => {
  return filename.endsWith('.vue') || filename.endsWith('.html')
    ? 'htmlmixed'
    : filename.endsWith('.css')
    ? 'css'
    : 'javascript';
};

export const validateFile = (
  filename: string,
  files: Record<string, HTMLElement>
) => {
  // 校验是否为可解析文件
  if (
    !['.html', '.css', '.js', '.ts', '.vue'].some((item) =>
      filename.endsWith(item)
    )
  ) {
    window.alert(
      'Code Sandbox 当前仅支持以 *.html、*.css、*.js、*.ts、*.vue 的文件'
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
