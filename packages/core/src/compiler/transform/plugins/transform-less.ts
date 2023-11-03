import less from 'less';
import { Hooks, ComplierPluginParams } from '@/compiler/type';

export async function transformLess(
  params: ComplierPluginParams
): Promise<Error[] | undefined> {
  const { fileMap } = params;
  const files = Object.keys(fileMap).map((filename) => fileMap[filename]);
  const errors: Error[] = [];

  await Promise.all(
    files
      .filter((file) => file.filename.endsWith('.less'))
      .map(async (file) => {
        let { code } = file;

        try {
          code = (await less.render(code)).css;
          file.compiled.css = code;
        } catch (error) {
          errors.push(error as Error);
        }
      })
  );

  return errors.length ? errors : undefined;
}

export default function (hooks: Hooks) {
  hooks.hook('transform', transformLess);
}
