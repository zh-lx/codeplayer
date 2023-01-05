export const getMode = (filename: string) => {
  return filename.endsWith('.vue') || filename.endsWith('.html')
    ? 'htmlmixed'
    : filename.endsWith('.css')
    ? 'css'
    : 'javascript';
};

export const validateFile = (filename: string) => {
  const result = ['.html', '.css', '.js', '.ts', '.vue'].some((item) =>
    filename.endsWith(item)
  );
  if (!result) {
    window.alert(
      'Code Sandbox 当前仅支持以 *.html、*.css、*.js、*.ts、*.vue 的文件'
    );
  }
  return result;
};
