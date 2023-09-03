import { File } from '@/compiler';
import { compileString } from 'sass'
import { Hooks } from '@/compiler/type'

export async function transformSaSS(file: File): Promise<Error[] | undefined> {
  let {filename, code} = file

  if (!filename.endsWith('.sass') && !filename.endsWith('.scss')) {
    return;
  }

  try {
    code = (await compileString(code)).css
    file.compiled.css = code;
  } catch (error) {
    return [error as Error]
  }
}

export default function(hooks: Hooks) {
  hooks.addHooks({
    transform: transformSaSS,
  })
}