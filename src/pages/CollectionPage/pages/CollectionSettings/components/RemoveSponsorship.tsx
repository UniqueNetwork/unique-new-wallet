import { useEffect, useState } from 'react';

import { useCollectionRemoveSponsorship } from '@app/api';
import { Button, StatusTransactionModal, useNotifications } from '@app/components';
import { useAccounts } from '@app/hooks';
import { ConfirmUpdateCollectionModal } from '@app/pages/CollectionPage/pages/CollectionSettings/components/ConfirmUpdateCollectionModal';

type Props = {
  collectionId?: number;
  onComplete?(): Promise<void>;
};

export const RemoveSponsorship = ({ collectionId, onComplete }: Props) => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { selectedAccount } = useAccounts();

  const {
    feeFormatted,
    getFee,
    feeError,
    feeLoading,
    submitWaitResult,
    submitWaitResultError,
    isLoadingSubmitResult,
  } = useCollectionRemoveSponsorship();
  const { error, info } = useNotifications();
  useEffect(() => {
    if (feeError) {
      error(feeError);
    }
    if (submitWaitResultError) {
      error(submitWaitResultError);
    }
  }, [feeError, submitWaitResultError]);

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

      info('The sponsorship removed successfully');
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
        title="Remove sponsorship"
        role="danger"
        onClick={() => setVisibleConfirmModal(true)}
      />
      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Removing sponsorship"
      />

      <ConfirmUpdateCollectionModal
        title="Remove sponsorship"
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleSubmit}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </>
  );
};
