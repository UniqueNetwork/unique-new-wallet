import { ArtificialAttributeItemType, AttributeItemType, EnumElemType, NFTMetaType, ProtobufAttributeType } from '@app/types';

export function str2vec (str: number[] | string): number[] {
  if (typeof str !== 'string') {
    return str;
  }

  return Array.from(str).map((x) => x.charCodeAt(0));
}

export const convertArtificialAttributesToProtobuf = (attributes: ArtificialAttributeItemType[]): AttributeItemType[] => {
  return attributes.map((attr: ArtificialAttributeItemType): AttributeItemType => {
    if (attr.fieldType === 'repeated') {
      return { ...attr, fieldType: 'enum', rule: 'repeated' };
    }

    return { ...attr } as AttributeItemType;
  });
};

export const fillProtobufJson = (attrs: AttributeItemType[]): ProtobufAttributeType => {
  const protobufJson: ProtobufAttributeType = {
    nested: {
      onChainMetaData: {
        nested: {
          NFTMeta: {
            fields: {}
          }
        }
      }
    }
  };

  try {
    if (attrs && attrs.length) {
      attrs.forEach((attr: AttributeItemType, ind: number) => {
        if (attr.fieldType === 'enum') {
          protobufJson.nested.onChainMetaData.nested[attr.name] = {
            options: {},
            values: {}
          };
          attr.values.forEach((value: string, index: number) => {
            (protobufJson.nested.onChainMetaData.nested[attr.name] as EnumElemType).values[`field${index + 1}`] = index;
            (protobufJson.nested.onChainMetaData.nested[attr.name] as EnumElemType).options[`field${index + 1}`] = `{"en":"${value}"}`;
          });
        }

        (protobufJson.nested.onChainMetaData.nested.NFTMeta as NFTMetaType).fields[attr.name] = {
          id: ind + 1,
          rule: attr.rule,
          type: attr.fieldType === 'string' ? 'string' : attr.name
        };
      });
    }
  } catch (e) {
    console.log('fillProtobufJson error', e);
  }

  return protobufJson;
};
