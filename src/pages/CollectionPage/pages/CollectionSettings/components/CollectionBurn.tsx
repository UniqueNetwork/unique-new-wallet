import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCollectionBurn } from '@app/api';
import { Button, StatusTransactionModal, useNotifications } from '@app/components';
import { useAccounts, useApi } from '@app/hooks';
import { ConfirmUpdateCollectionModal } from '@app/pages/CollectionPage/pages/CollectionSettings/components/ConfirmUpdateCollectionModal';

type Props = {
  canBurn: boolean;
  collectionId?: number;
  collectionName?: string;
  onComplete?(): Promise<void>;
};

export const CollectionBurn = ({
  canBurn,
  collectionId,
  collectionName,
  onComplete,
}: Props) => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { selectedAccount } = useAccounts();
  const { currentChain } = useApi();

  const {
    feeFormatted,
    getFee,
    feeError,
    feeLoading,
    submitWaitResult,
    isLoadingSubmitResult,
  } = useCollectionBurn();
  const navigate = useNavigate();
  const { error, info } = useNotifications();
  useEffect(() => {
    if (feeError) {
      error(feeError);
    }
  }, [feeError]);

  useEffect(() => {
    if (!isVisibleConfirmModal || !collectionId || !selectedAccount?.address) {
      return;
    }
    getFee({
      collectionId,
      address: selectedAccount?.address,
    });
  }, [collectionId, getFee, isVisibleConfirmModal, selectedAccount?.address]);

  const handleBurnCollection = async () => {
    if (!collectionId || !selectedAccount) {
      return;
    }

    setVisibleConfirmModal(false);

    try {
      await submitWaitResult(
        {
          payload: {
            collectionId,
            address: selectedAccount.address,
          },
        },
        {
          onSuccess: onComplete,
        },
      );
      info('The collection burned successfully');
      navigate(`/${currentChain.network}/my-collections`);
    } catch (e: any) {
      error(e.message);
    }
  };

  if (!collectionId) {
    return null;
  }

  return (
    <>
      <Button
        title="Burn collection"
        disabled={!canBurn}
        iconLeft={{
          size: 15,
          name: 'burn',
          color: 'var(--color-coral-500)',
        }}
        role="danger"
        onClick={() => setVisibleConfirmModal(true)}
      />
      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Burning collection"
      />

      <ConfirmUpdateCollectionModal
        title={`Burn collection ${collectionName} [id: ${collectionId}]`}
        warning="You will not be able to undo this action."
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleBurnCollection}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </>
  );
};
