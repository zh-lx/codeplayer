import { transform } from 'sucrase';
import { File } from '@/compiler';
import { Hooks } from '@/compiler/type'

export async function transformReact(file: File): Promise<Error[] | undefined> {
  let {filename, code} = file

  if (!filename.endsWith('.tsx') && !filename.endsWith('.jsx')) {
    return;
  }

  try {
    code = await transform(code, {
      transforms: ['typescript', 'jsx'],
      production: true,
    }).code;
    file.compiled.js = code;
  } catch (error) {
    return [error as Error]
  }
}

export default function(hooks: Hooks) {
  hooks.addHooks({
    transform: transformReact,
  })
}