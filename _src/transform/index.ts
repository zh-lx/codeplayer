import { File } from '../utils/file';
import { shouldTransformRef, transformRef } from '@vue/compiler-sfc';
import { transformTS } from './transform-ts';
import { transformVue3 } from './transform-vue3';

// transform vue sfc code
export const compileFile = async (
  result: { errors: (string | Error)[] },
  { filename, code, compiled }: File
) => {
  if (!code.trim()) {
    result.errors = [];
    return;
  }

  // compile css
  if (filename.endsWith('.css')) {
    compiled.css = code;
    result.errors = [];
    return;
  }

  // compile js&ts
  if (filename.endsWith('.js') || filename.endsWith('.ts')) {
    if (shouldTransformRef(code)) {
      code = transformRef(code, { filename }).code;
    }
    if (filename.endsWith('.ts')) {
      code = await transformTS(code);
    }
    compiled.js = code;
    result.errors = [];
    return;
  }

  // vue3
  if (filename.endsWith('.vue')) {
    const _code = await transformVue3(result, {
      filename,
      code,
      compiled,
    } as File);
    return _code;
  }

  result.errors = [];
  return;
};
