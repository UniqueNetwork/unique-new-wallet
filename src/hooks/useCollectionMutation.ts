import { useContext, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { convertArtificialAttributesToProtobuf, fillProtobufJson } from '@app/utils';
import { AttributeItemType, NftCollectionDTO, ProtobufAttributeType } from '@app/types';
import { useAccounts } from '@app/hooks/useAccounts';
import { useCollectionCreate, useExtrinsicSubmit } from '@app/api';

import { CollectionFormContext } from '../context/CollectionFormContext/CollectionFormContext';

export const useCollectionMutation = () => {
  const {
    attributes,
    mainInformationForm,
    ownerCanDestroy,
    ownerCanTransfer,
    tokenLimit,
  } = useContext(CollectionFormContext);
  const [isCreatingCollection, setSsCreatingCollection] = useState<boolean>(false);
  const { selectedAccount, signMessage } = useAccounts();
  const { createCollection } = useCollectionCreate();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { error, info } = useNotifications();

  const converted: AttributeItemType[] =
    convertArtificialAttributesToProtobuf(attributes);
  const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);

  const collectionFull: NftCollectionDTO = {
    address: selectedAccount?.address ?? '',
    description: mainInformationForm.values.description ?? '',
    limits: {
      ownerCanDestroy,
      ownerCanTransfer,
      tokenLimit: tokenLimit ?? 0,
    },
    metaUpdatePermission: 'ItemOwner',
    mode: 'Nft',
    name: mainInformationForm.values.name ?? '',
    properties: {
      offchainSchema: '',
      schemaVersion: 'Unique',
      variableOnChainSchema: '{}',
      constOnChainSchema: protobufJson,
    },
    tokenPrefix: mainInformationForm.values.tokenPrefix ?? '',
    permissions: {
      access: 'Normal',
      mintMode: true,
      nesting: 'Disabled',
    },
    tokenPropertyPermissions: {
      constData: {
        mutable: true,
        collectionAdmin: true,
        tokenOwner: true,
      },
    },
  };

  // TODO - add error handler for low balance - Error. Balance too low
  const onCreateCollection = async () => {
    setSsCreatingCollection(true);

    const createResp = await createCollection(collectionFull);

    if (!createResp?.signerPayloadJSON) {
      error('Create collection error', {
        name: 'Create collection',
        size: 32,
        color: 'white',
      });

      setSsCreatingCollection(false);

      return;
    }

    const signature = await signMessage(createResp.signerPayloadJSON, selectedAccount);

    await submitExtrinsic({
      signerPayloadJSON: createResp.signerPayloadJSON,
      signature,
    });

    info('Collection successfully created', {
      name: 'Create collection',
      size: 32,
      color: 'white',
    });

    setSsCreatingCollection(false);
  };

  return {
    isCreatingCollection,
    onCreateCollection,
  };
};