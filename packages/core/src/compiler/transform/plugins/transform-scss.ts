import { Hooks, ComplierPluginParams } from '@/compiler/type';
import { compileString } from 'sass';

export async function transformSaSS(
  params: ComplierPluginParams
): Promise<Error[] | undefined> {
  const { fileMap } = params;
  const files = Object.keys(fileMap).map((filename) => fileMap[filename]);
  const errors: Error[] = [];

  await Promise.all(
    files
      .filter(
        ({ filename }) =>
          filename.endsWith('.sass') || filename.endsWith('.scss')
      )
      .map(async (file) => {
        let { code } = file;

        try {
          code = (await compileString(code)).css;
          file.compiled.css = code;
        } catch (error) {
          errors.push(error as Error);
        }
      })
  );

  return errors.length ? errors : undefined;
}

export default function (hooks: Hooks) {
  hooks.hook('transform', transformSaSS);
}
