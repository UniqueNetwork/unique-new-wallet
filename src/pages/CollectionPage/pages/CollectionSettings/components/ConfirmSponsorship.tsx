import { useEffect, useState } from 'react';

import { useCollectionConfirmSponsorship } from '@app/api';
import { Button, StatusTransactionModal, useNotifications } from '@app/components';
import { useAccounts } from '@app/hooks';
import { ConfirmUpdateCollectionModal } from '@app/pages/CollectionPage/pages/CollectionSettings/components/ConfirmUpdateCollectionModal';

type Props = {
  collectionId?: number;
  onComplete?(): Promise<void>;
};

export const ConfirmSponsorship = ({ collectionId, onComplete }: Props) => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { selectedAccount } = useAccounts();

  const {
    feeFormatted,
    getFee,
    feeError,
    feeLoading,
    submitWaitResult,
    isLoadingSubmitResult,
  } = useCollectionConfirmSponsorship();
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

  const handleSubmit = async () => {
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

      info('The sponsorship confirmed successfully');
    } catch (e: any) {
      error(e.message);
    }
  };

  if (!collectionId || !selectedAccount?.address) {
    return null;
  }

  return (
    <>
      <Button
        title="Confirm sponsorship"
        role="primary"
        onClick={() => setVisibleConfirmModal(true)}
      />
      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Confirming sponsorship"
      />

      <ConfirmUpdateCollectionModal
        title="Confirm sponsorship"
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleSubmit}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </>
  );
};
