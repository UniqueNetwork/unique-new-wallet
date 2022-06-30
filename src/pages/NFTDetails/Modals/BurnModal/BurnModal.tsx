import React, { useEffect, useState, VFC } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { useAccounts, useFee } from '@app/hooks';
import { useExtrinsicSubmit, ViewToken } from '@app/api';
import { AskBurnModal, BurnStagesModal } from '@app/pages/NFTDetails/Modals/BurnModal';
import { useExtrinsicStatus } from '@app/api/restApi/extrinsic/hooks/useExtrinsicStatus';
import { useTokenBurn } from '@app/api/restApi/token/hooks/useTokenBurn';
import { ROUTE } from '@app/routes';

interface BurnModalProps {
  isVisible: boolean;
  token?: ViewToken;
  onClose(): void;
  onComplete(): void;
}

export const BurnModal: VFC<BurnModalProps> = ({
  isVisible,
  token,
  onClose,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { selectedAccount, signMessage } = useAccounts();
  const { tokenBurn } = useTokenBurn();
  const { submitExtrinsic } = useExtrinsicSubmit();
  const { info, error } = useNotifications();
  const [status, setStatus] = useState<'ask-burn' | 'burn-stages'>('ask-burn');

  const [txHash, setTxHash] = useState<string>();
  const { data: extrinsicStatus } = useExtrinsicStatus(txHash);
  const { fee, getFee } = useFee();

  const calculateFee = async () => {
    const tx = await generateTx();

    if (!tx) {
      return;
    }

    await getFee(tx);
  };

  const generateTx = async () => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    try {
      return await tokenBurn({
        address: selectedAccount.address,
        collectionId: token.collection_id,
        tokenId: token.token_id,
      });
    } catch (e) {
      error('Burn generateTx error', {
        name: 'Burn NFT',
        size: 32,
        color: 'white',
      });

      return null;
    }
  };

  const onBurn = async () => {
    if (!token || !selectedAccount?.address) {
      return;
    }

    setStatus('burn-stages');
    try {
      const tx = await generateTx();

      if (!tx) {
        return;
      }

      const signature = await signMessage(tx.signerPayloadJSON);

      if (!signature) {
        error('Burn error', {
          name: 'Burn NFT',
          size: 32,
          color: 'white',
        });

        return;
      }

      const submitResult = await submitExtrinsic({
        ...tx,
        signature,
      });

      if (submitResult) {
        setTxHash(submitResult.hash);
      }
    } catch (e) {
      // TODO: move this message to general dictionary
      error('Transfer cancelled');
      onClose();
    }
  };

  useEffect(() => {
    if (!extrinsicStatus) {
      return;
    }
    const { isCompleted, isError, errorMessage } = extrinsicStatus;

    if (isCompleted) {
      onComplete();
      info('Burn token completed successfully');
      navigate(ROUTE.MY_TOKENS);
    }

    if (isError) {
      error(errorMessage);
      onClose();
    }
  }, [extrinsicStatus]);

  useEffect(() => {
    void calculateFee();
  }, []);

  if (!selectedAccount || !token) {
    return null;
  }

  if (status === 'ask-burn') {
    return (
      <AskBurnModal
        fee={fee}
        isVisible={isVisible}
        onBurn={() => {
          void onBurn();
        }}
        onClose={onClose}
      />
    );
  }
  if (status === 'burn-stages') {
    return <BurnStagesModal />;
  }

  return null;
};
