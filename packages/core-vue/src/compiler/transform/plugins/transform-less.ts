import { File } from '@/compiler';
import less from 'less'
import { Hooks } from '@/compiler/type'

export async function transformLess(file: File): Promise<Error[] | undefined> {
  let {filename, code} = file

  if (!filename.endsWith('.less')) {
    return;
  }

  try {
    code = (await less.render(code)).css
    file.compiled.css = code;
  } catch (error) {
    return [error as Error]
  }
}

export default function(hooks: Hooks) {
  hooks.addHooks({
    transform: transformLess,
  })
}