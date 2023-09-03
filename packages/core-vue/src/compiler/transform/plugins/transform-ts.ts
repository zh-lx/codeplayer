import { transform } from 'sucrase';
import { File } from '@/compiler';
import { Hooks } from '@/compiler/type';

export async function transformTS(file: File): Promise<Error[] | undefined> {
  let { filename, code } = file;

  if (!filename.endsWith('.ts') && !filename.endsWith('.js')) {
    return;
  }

  try {
    if (filename.endsWith('.ts')) {
      code = await transform(code, {
        transforms: ['typescript'],
      }).code;
    }

    file.compiled.js = code;
  } catch (error) {
    return [error as Error];
  }
}

export default function (hooks: Hooks) {
  hooks.addHooks({
    transform: transformTS,
  });
}
