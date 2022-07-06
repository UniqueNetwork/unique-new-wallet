import { useCallback, useContext, useEffect, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { useQueryClient } from 'react-query';

import { convertArtificialAttributesToProtobuf, fillProtobufJson } from '@app/utils';
import { AttributeItemType, NftCollectionDTO, ProtobufAttributeType } from '@app/types';
import { useAccounts } from '@app/hooks/useAccounts';
import { useCollectionCreate, useExtrinsicStatus, useExtrinsicSubmit } from '@app/api';
import { useFee } from '@app/hooks/useFee';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

import { CollectionFormContext } from '../context/CollectionFormContext/CollectionFormContext';

export const useCollectionMutation = () => {
  const {
    attributes,
    mainInformationForm,
    ownerCanDestroy,
    ownerCanTransfer,
    tokenLimit,
  } = useContext(CollectionFormContext);

  const [txHash, setTxHash] = useState<string | undefined>();
  const [isCreatingCollection, setSsCreatingCollection] = useState<boolean>(false);

  const { data: extrinsicStatus } = useExtrinsicStatus(txHash);
  const { selectedAccount, signMessage } = useAccounts();
  const { createCollection } = useCollectionCreate();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { error, info } = useNotifications();
  const { fee, getFee } = useFee();

  useEffect(() => {
    if (extrinsicStatus) {
      const { isCompleted, isError, errorMessage } = extrinsicStatus;

      if (isCompleted) {
        setTxHash('');
        setSsCreatingCollection(false);

        if (isError) {
          error(errorMessage);
        } else {
          info('Creation completed successfully');
        }
      }
    }
  }, [extrinsicStatus]);

  const generateExtrinsic = useCallback(async () => {
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

    try {
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

    const createResp = (await generateExtrinsic()) as UnsignedTxPayloadResponse;

    if (!createResp) {
      setSsCreatingCollection(false);

      error('Create collection error', {
        name: 'Create collection',
        size: 32,
        color: 'white',
      });
    }

    try {
      const signature = await signMessage(createResp.signerPayloadJSON, selectedAccount);

      if (!signature) {
        error('Sign transaction error', {
          name: 'Create collection',
          size: 32,
          color: 'white',
        });

        setSsCreatingCollection(false);

        return;
      }

      const submitResult = await submitExtrinsic({
        signerPayloadJSON: createResp.signerPayloadJSON,
        signature,
      });

      if (submitResult) {
        setTxHash(submitResult.hash);
      } else {
        error('Submit exstrinsic error');
      }
    } catch (e) {
      error('Sign transaction error');

      setSsCreatingCollection(false);
    }
  };

  return {
    fee,
    isCreatingCollection,
    generateExtrinsic,
    onCreateCollection,
  };
};
