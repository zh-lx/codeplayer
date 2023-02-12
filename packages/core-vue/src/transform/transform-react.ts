import { transform } from 'sucrase';

export async function transformReact(src: string) {
  return transform(src, {
    transforms: ['typescript', 'jsx'],
    production: true,
  }).code;
}
