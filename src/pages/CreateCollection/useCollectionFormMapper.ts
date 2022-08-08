import { config } from '@app/config';
import { CreateCollectionNewRequest } from '@app/types/Api';

import { CollectionForm } from './types';

export const useCollectionFormMapper = () => {
  const mapper = (form: CollectionForm): CreateCollectionNewRequest => {
    const {
      address,
      name,
      description,
      symbol,
      tokenLimit,
      ownerCanDestroy,
      sponsorAddress,
      coverPictureIpfsCid,
    } = form;

    const request: CreateCollectionNewRequest = {
      name,
      address,
      description,
      sponsorship: {
        isConfirmed: false,
        address: sponsorAddress,
      },
      tokenPrefix: symbol,
      limits: {
        tokenLimit,
        ownerCanDestroy,
      },
      schema: {
        coverPicture: {
          ipfsCid: coverPictureIpfsCid || '',
        },
        attributesSchema: {},
        attributesSchemaVersion: '1.0.0',
        image: {
          urlTemplate: `${config.IPFSGateway}/{infix}`,
        },
        schemaName: 'unique',
        schemaVersion: '1.0.0',
      },
    };

    form.attributes?.forEach((attr, index) => {
      request.schema.attributesSchema[index] = {
        type: 'string',
        name: { _: attr.name } as any,
        optional: attr.optional.id === 'optional',
        isArray: attr.type.id === 'repeated',
      };

      if (attr.values?.length) {
        console.log(attr.values?.length);
        request.schema.attributesSchema[index].enumValues = attr.values.reduce(
          (acc, val, index) => {
            return {
              ...acc,
              [index]: { _: val },
            };
          },
          {},
        );
      }
    });

    return request;
  };

  return mapper;
};
