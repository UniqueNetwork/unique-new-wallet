import { TAttributes } from '../api/graphQL';

export const getAttributesToShow = (attributes: TAttributes): TAttributes => {
  const attributesToShow = { ...attributes };

  if (attributesToShow.ipfsJson) {
    delete attributesToShow.ipfsJson;
  }

  Object.keys(attributesToShow).map((key) => {
    if (typeof attributesToShow[key] === 'string') {
      attributesToShow[key] = (attributesToShow[key] as string).substring(0, 30);
    }

    return key;
  });

  return attributesToShow;
};
