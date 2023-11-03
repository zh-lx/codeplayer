import { transform } from 'sucrase';
import { Hooks, ComplierPluginParams } from '@/compiler/type';

export async function transformReact(
  params: ComplierPluginParams
): Promise<Error[] | undefined> {
  const { fileMap } = params;
  const files = Object.keys(fileMap).map((filename) => fileMap[filename]);
  const errors: Error[] = [];

  await Promise.all(
    files
      .filter(
        ({ filename }) => filename.endsWith('.tsx') || filename.endsWith('.jsx')
      )
      .map(async (file) => {
        let { code } = file;

        try {
          code = await transform(code, {
            transforms: ['typescript', 'jsx'],
            production: true,
          }).code;
          file.compiled.js = code;
        } catch (error) {
          errors.push(error as Error);
        }
      })
  );

  return errors.length ? errors : undefined;
}

export default function (hooks: Hooks) {
  hooks.hook('transform', transformReact);
}
