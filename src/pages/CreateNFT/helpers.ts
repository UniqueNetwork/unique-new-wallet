import { CreateTokenBody, CreateTokenPayload } from '@unique-nft/sdk';

import { CreateTokenNewDto } from '@app/types/Api';
import { AttributeSchema } from '@app/api/graphQL/types';

import {
  Attribute,
  AttributeOption,
  AttributesForFilter,
  FilledTokenForm,
  NewToken,
} from './types';

const attributeMapper = (attribute?: Attribute) => {
  if (
    attribute === '' ||
    attribute === null ||
    attribute === undefined ||
    (Array.isArray(attribute) && !attribute?.length)
  ) {
    return null;
  }

  if (Array.isArray(attribute)) {
    return attribute.map((attr: AttributeOption) => attr.id);
  }

  if (typeof attribute === 'string') {
    return { _: attribute };
  }

  if (typeof attribute === 'object') {
    return (attribute as AttributeOption).id;
  }

  return attribute;
};

export const mapTokenForm = (formData: FilledTokenForm): CreateTokenNewDto => {
  const mappedTokenDto: CreateTokenNewDto = {
    owner: formData.address,
    address: formData.address,
    collectionId: formData.collectionId,
    data: {
      image: {
        ipfsCid: formData.imageIpfsCid,
      },
      encodedAttributes: {},
    },
  };

  if (formData.attributes?.length) {
    mappedTokenDto.data.encodedAttributes = formData.attributes.reduce(
      (acc, attr, index) => {
        const mapped = attributeMapper(attr);
        if (mapped === null) {
          return acc;
        }

        return {
          ...acc,
          [index]: mapped,
        };
      },
      {},
    );
  }

  return mappedTokenDto;
};

export const mapTokensToPayload = (
  tokens: NewToken[],
  collectionId: number,
  owner: string,
): CreateTokenPayload[] => {
  return tokens.map((token) => mapNewToken(token, collectionId, owner));
};

export const mapTokensToPayload$1 = (
  tokens: NewToken[],
  collectionId: number,
  owner: string,
): CreateTokenBody[] => {
  return tokens.map((token) => mapNewToken$1(token, collectionId, owner));
};

export const mapNewToken = (
  token: NewToken,
  collectionId: number,
  owner: string,
): CreateTokenPayload => {
  const mappedTokenDto: CreateTokenPayload = {
    data: {
      image: {
        ipfsCid: token.ipfsCid?.cid,
      },
      encodedAttributes: {},
    },
  };

  if (mappedTokenDto.data && token.attributes?.length) {
    mappedTokenDto.data.encodedAttributes = token.attributes.reduce(
      (acc, attr, index) => {
        const mapped = attributeMapper(attr);
        if (mapped === null) {
          return acc;
        }

        return {
          ...acc,
          [index]: mapped,
        };
      },
      {},
    );
  }

  return mappedTokenDto;
};
export const mapNewToken$1 = (
  token: NewToken,
  collectionId: number,
  owner: string,
): CreateTokenBody => {
  const mappedTokenDto: CreateTokenBody = {
    data: {
      image: {
        ipfsCid: token.ipfsCid?.cid,
      },
      encodedAttributes: {},
    },
    address: owner,
    collectionId,
  };

  if (mappedTokenDto.data && token.attributes?.length) {
    mappedTokenDto.data.encodedAttributes = token.attributes.reduce(
      (acc, attr, index) => {
        const mapped = attributeMapper(attr);
        if (mapped === null) {
          return acc;
        }

        return {
          ...acc,
          [index]: mapped,
        };
      },
      {},
    );
  }

  return mappedTokenDto;
};

export const checkRequiredAttributes = (
  tokens: NewToken[],
  attributeSchema?: Record<number, AttributeSchema>,
) => {
  if (!attributeSchema) {
    return;
  }

  return tokens.find(({ attributes }) => {
    return Object.values(attributeSchema).some(
      ({ optional }, index) => !optional && !attributes[index],
    );
  });
};

export const scrollToTokenCard = (id: number) => {
  const element = document.getElementById(`token-${id}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export const getAttributesFromTokens = (
  attributesSchema: Record<number, AttributeSchema>,
  tokens: NewToken[],
) => {
  // attributes formatted for Filter component
  const attributesForFilter: AttributesForFilter = {};

  const addSelectableValue = (
    attributeName: string,
    index: number,
    value: number,
    enumValues: Record<number, { _: string }>,
  ) => {
    const existsValue = attributesForFilter[attributeName].find(({ id }) => id === value);
    if (existsValue) {
      existsValue.count += 1;
    } else {
      attributesForFilter[attributeName].push({
        index,
        key: attributeName,
        id: value,
        value: enumValues[value]._,
        count: 1,
      });
    }
  };

  tokens.forEach(({ attributes }) => {
    if (!attributes) {
      return;
    }
    // Calculate filters to show
    attributes.forEach((attribute, index) => {
      const { name, isArray, enumValues } = attributesSchema[index];
      const attributeName = name?._?.toLocaleLowerCase();

      if (!attributeName) {
        return;
      }

      if (!attributesForFilter[attributeName]) {
        attributesForFilter[attributeName] = [];
      }

      const value = attributeMapper(attribute);

      if (!value) {
        return;
      }

      if (enumValues) {
        if (isArray) {
          (value as number[]).forEach((_value) => {
            addSelectableValue(attributeName, index, _value, enumValues);
          });
          return;
        }
        addSelectableValue(attributeName, index, value as number, enumValues);

        return;
      }

      const stringValue = (value as { _: string })?._;

      const existsValue = attributesForFilter[attributeName].find(
        ({ value }) => value === stringValue,
      );
      if (existsValue) {
        existsValue.count += 1;
      } else {
        attributesForFilter[attributeName].push({
          index,
          key: attributeName,
          value: stringValue,
          count: 1,
        });
      }
    });
  });

  return attributesForFilter;
};

export const capitalize = (text: string) => `${text[0].toUpperCase()}${text.slice(1)}`;

export const ellipsisText = (text: string, allowSymbols = 30) => {
  if (text.length > allowSymbols) {
    const nextSpacePosition = text.indexOf(' ', allowSymbols);
    if (!nextSpacePosition) {
      return text;
    }
    return text.slice(0, nextSpacePosition) + '…';
  }
  return text;
};
