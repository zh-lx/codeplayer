import { transform } from 'sucrase';

export async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
  }).code;
}
