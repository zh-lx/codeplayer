export const convertToNumber = (len: number | string, total: number) => {
  if (typeof len === 'number') {
    return len;
  }
  if (len.endsWith('%')) {
    return Number(len.slice(0, len.length - 1)) * total * 0.01;
  }
  if (len.endsWith('px')) {
    return Number(len.slice(0, len.length - 2));
  }
  return Number(len);
};
