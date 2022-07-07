import { useCallback, useContext, useEffect, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { convertArtificialAttributesToProtobuf, fillProtobufJson } from '@app/utils';
import { AttributeItemType, NftCollectionDTO, ProtobufAttributeType } from '@app/types';
import {
  CollectionApiService,
  useCollectionCreate,
  useSignAndSubmitExtrinsic,
} from '@app/api';
import { UnsignedTxPayloadResponse } from '@app/types/Api';
import { useAccounts } from '@app/hooks/useAccounts';
import { useFee } from '@app/hooks/useFee';

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

  const {
    status,
    error: errorMessage,
    signAndSubmitExtrinsic,
  } = useSignAndSubmitExtrinsic(CollectionApiService.collectionCreateMutation);
  const { selectedAccount } = useAccounts();
  const { createCollection } = useCollectionCreate();
  const { error, info } = useNotifications();
  const { fee, getFee } = useFee();

  useEffect(() => {
    if (isCreatingCollection) {
      const collectionFull = generateCollectionFull();
      // signAndSubmitExtrinsic(collectionFull);
    }
  }, [isCreatingCollection]);

  useEffect(() => {
    if (status === 'success') {
      setSsCreatingCollection(false);
      info('Collection created successfully');
    }

    if (status === 'error') {
      setSsCreatingCollection(false);
      error(errorMessage);
    }
  }, [status]);

  const generateCollectionFull = () => {
    const converted: AttributeItemType[] =
      convertArtificialAttributesToProtobuf(attributes);
    const protobufJson: ProtobufAttributeType = fillProtobufJson(converted);
    const varDataWithImage = {
      collectionCover: mainInformationForm.values.coverImgAddress,
    };

    const collectionFull: NftCollectionDTO = {
      address: selectedAccount?.address ?? '',
      description: mainInformationForm.values.description ?? '',
      limits: {
        ownerCanDestroy,
        ownerCanTransfer,
        tokenLimit,
      },
      metaUpdatePermission: 'ItemOwner',
      mode: 'Nft',
      name: mainInformationForm.values.name ?? '',
      properties: {
        offchainSchema: '',
        schemaVersion: 'Unique',
        variableOnChainSchema: JSON.stringify(varDataWithImage),
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

    return collectionFull;
  };

  const generateExtrinsic = useCallback(async () => {
    try {
      const collectionFull = generateCollectionFull();
      const createResp = await createCollection(collectionFull);

      if (!createResp?.signerPayloadJSON) {
        return;
      }

      await getFee(createResp);

      return createResp;
    } catch (e) {
      console.error(e);

      error('Creating collection error', {
        name: 'Create collection',
        size: 32,
        color: 'white',
      });
    }
  }, [
    attributes,
    createCollection,
    error,
    getFee,
    mainInformationForm.values.coverImgAddress,
    mainInformationForm.values.description,
    mainInformationForm.values.name,
    mainInformationForm.values.tokenPrefix,
    ownerCanDestroy,
    ownerCanTransfer,
    selectedAccount?.address,
    tokenLimit,
  ]);

  // TODO - add error handler for low balance - Error. Balance too low
  const onCreateCollection = async () => {
    setSsCreatingCollection(true);

    const createResult = (await generateExtrinsic()) as UnsignedTxPayloadResponse;
    if (!createResult) {
      setSsCreatingCollection(false);
      error('Unsigned payload response is not define');
    }
  };

  return {
    fee,
    status,
    isCreatingCollection,
    generateExtrinsic,
    onCreateCollection,
  };
};
