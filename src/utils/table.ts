export const getDeepValue = <T extends Record<string, any>>(object: T, path: string) => {
  return path
    .split(/[.[\]'"]/)
    .filter((p) => p)
    .reduce((o, p) => {
      return o ? o[p] : undefined;
    }, object);
};
