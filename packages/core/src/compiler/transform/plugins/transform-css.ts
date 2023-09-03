import { File } from '@/compiler';
import { Hooks } from '@/compiler/type';

export async function transformCSS(file: File): Promise<Error[] | undefined> {
  const { filename, code } = file;

  if (!filename.endsWith('.css')) {
    return;
  }

  file.compiled.css = code;
  return undefined;
}

export default function (hooks: Hooks) {
  hooks.addHooks({
    transform: transformCSS,
  });
}
