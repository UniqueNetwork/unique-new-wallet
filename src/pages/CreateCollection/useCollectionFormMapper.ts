/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*eslint-disable @typescript-eslint/no-unnecessary-type-assertion*/
import { CreateCollectionBody } from '@unique-nft/sdk';

import { config } from '@app/config';

import { CollectionForm } from './types';

export const useCollectionFormMapper = () => {
  const mapper = (form: CollectionForm): CreateCollectionBody => {
    const {
      address,
      name,
      description,
      symbol,
      tokenLimit,
      ownerCanDestroy,
      sponsorAddress,
      coverPictureIpfsCid,
      nesting,
    } = form;

    const request: CreateCollectionBody = {
      name,
      address,
      description,
      permissions: {
        nesting,
      },
      sponsorship: {
        isConfirmed: false,
        address: sponsorAddress,
      },
      tokenPrefix: symbol,
      limits: {
        tokenLimit,
        ownerCanDestroy,
        transfersEnabled: true,
        ownerCanTransfer: true,
      },
      schema: {
        coverPicture: {
          ipfsCid: coverPictureIpfsCid || '',
        },
        image: {
          urlTemplate: `${config.IPFSGateway}/{infix}`,
        },
        schemaName: 'unique',
        schemaVersion: '1.0.0',
      },
    };

    if (form.attributes?.length) {
      request.schema!.attributesSchema = {};
      request.schema!.attributesSchemaVersion = '1.0.0';

      form.attributes.forEach((attr, index) => {
        request.schema!.attributesSchema![index] = {
          type: 'string',
          name: { _: attr.name } as any,
          optional: attr.optional.id === 'optional',
          isArray: attr.type.id === 'repeated',
        };

        if (attr.values?.length) {
          request.schema!.attributesSchema![index].enumValues = attr.values.reduce(
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
    }

    return request;
  };

  return mapper;
};
