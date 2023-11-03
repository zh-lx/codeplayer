import { transform } from 'sucrase';
import { Hooks, ComplierPluginParams } from '@/compiler/type';

export async function transformTS(
  params: ComplierPluginParams
): Promise<Error[] | undefined> {
  const { fileMap } = params;
  const files = Object.keys(fileMap).map((filename) => fileMap[filename]);
  const errors: Error[] = [];

  await Promise.all(
    files
      .filter(
        ({ filename }) => filename.endsWith('.ts') || filename.endsWith('.js')
      )
      .map(async (file) => {
        let { filename, code } = file;

        try {
          if (filename.endsWith('.ts')) {
            code = await transform(code, {
              transforms: ['typescript'],
            }).code;
          }

          file.compiled.js = code;
        } catch (error) {
          errors.push(error as Error);
        }
      })
  );

  return errors.length ? errors : undefined;
}

export default function (hooks: Hooks) {
  hooks.hook('transform', transformTS);
}
