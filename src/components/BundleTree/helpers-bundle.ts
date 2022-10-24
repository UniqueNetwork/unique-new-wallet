import { INestingToken } from '@app/components/BundleTree/types';

export const countNestedChildren = (nestingChildTokens: INestingToken[]) => {
  let count = 0;
  const countChildren = (tokenChildren: INestingToken[]) => {
    if (tokenChildren.length === 0) {
      return count;
    } else {
      count += tokenChildren.length;
      // @ts-ignore
      tokenChildren.forEach((child) => countChildren(child.nestingChildTokens || []));
    }
  };
  countChildren(nestingChildTokens || []);
  return count;
};
