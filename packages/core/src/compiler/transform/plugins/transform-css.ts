import { Hooks, ComplierPluginParams } from '@/compiler/type';

export async function transformCSS(
  params: ComplierPluginParams
): Promise<Error[] | undefined> {
  const { fileMap } = params;
  const files = Object.keys(fileMap).map((filename) => fileMap[filename]);

  await Promise.all(
    files
      .filter((file) => file.filename.endsWith('.css'))
      .map((file) => {
        const { code } = file;

        file.compiled.css = code;
      })
  );

  return;
}

export default function (hooks: Hooks) {
  hooks.hook('transform', transformCSS);
}
