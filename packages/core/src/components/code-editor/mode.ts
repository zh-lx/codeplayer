import { ModeSpec, ModeSpecOptions } from 'codemirror';

export const getMode: (
  filename: string
) => string | ModeSpec<ModeSpecOptions> = (filename) => {
  if (filename.endsWith('.vue')) {
    return { name: 'vue' };
  }
  if (filename.endsWith('.html')) {
    return 'htmlmixed';
  }
  if (filename.endsWith('.css')) {
    return 'css';
  }
  if (filename.endsWith('.js')) {
    return 'javascript';
  }
  if (filename.endsWith('.ts')) {
    return { name: 'javascript', typescript: true };
  }
  if (filename.endsWith('.jsx')) {
    return 'jsx';
  }
  if (filename.endsWith('.tsx')) {
    return {
      name: 'jsx',
      base: { name: 'javascript', typescript: true },
    } as unknown as ModeSpec<ModeSpecOptions>;
  }
  if (filename.endsWith('.json')) {
    return { name: 'javascript' };
  }
  return 'javascript';
};
