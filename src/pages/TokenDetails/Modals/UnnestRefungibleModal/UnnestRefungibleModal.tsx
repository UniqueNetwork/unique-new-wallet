import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { Address } from '@unique-nft/utils';
import { useNavigate } from 'react-router-dom';

import { TokenModalsProps, UnnestStagesModal } from '@app/pages/TokenDetails/Modals';
import { Modal, TransferBtn, Loader, useNotifications } from '@app/components';
import { TNestingToken } from '@app/pages/TokenDetails/type';
import { useTokenGetBalance, useTokenRefungibleTransfer } from '@app/api';
import { useAccounts } from '@app/hooks';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { queryKeys } from '@app/api/restApi/keysConfig';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';

export const UnnestRefungibleModal = ({
  onClose,
  onComplete,
  token,
}: TokenModalsProps<TNestingToken>) => {
  const {
    getFee,
    feeFormatted,
    feeLoading,
    feeError,
    submitWaitResult,
    isLoadingSubmitResult,
    submitWaitResultError,
  } = useTokenRefungibleTransfer();
  const { selectedAccount } = useAccounts();
  const { error, info } = useNotifications();
  const queryClient = useQueryClient();
  const getTokenPath = useGetTokenPath();
  const navigate = useNavigate();
  const [isWaitingComplete, setIsWaitingComplete] = useState(false);

  const parentBundleAddress = useMemo(() => {
    if (!token || !token.nestingParentToken) {
      return;
    }
    const { collectionId, tokenId } = token.nestingParentToken;
    return Address.nesting.idsToAddress(collectionId, tokenId);
  }, [token]);

  const { data: fractionsBalance } = useTokenGetBalance({
    collectionId: token?.collectionId,
    tokenId: token?.tokenId,
    address: parentBundleAddress,
    isFractional: true,
  });

  const unnestData = useMemo(() => {
    if (!token || !parentBundleAddress || !selectedAccount) {
      return;
    }

    return {
      address: selectedAccount?.address,
      collectionId: token.collectionId,
      tokenId: token.tokenId,
      from: parentBundleAddress,
      to: selectedAccount.address,
      amount: fractionsBalance?.amount,
    };
  }, [selectedAccount, token, fractionsBalance, parentBundleAddress]);

  useEffect(() => {
    unnestData && getFee(unnestData);
  }, [getFee, unnestData]);

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  useEffect(() => {
    if (!submitWaitResultError) {
      return;
    }
    error(submitWaitResultError);
  }, [submitWaitResultError]);

  const handleSubmit = async () => {
    if (!unnestData) {
      return;
    }
    try {
      setIsWaitingComplete(true);
      await submitWaitResult({
        payload: unnestData,
      });

      await onComplete();
      info(`${token?.name} belongs to you now`);

      navigate(getTokenPath(unnestData.to, unnestData.collectionId, unnestData.tokenId));

      queryClient.invalidateQueries(queryKeys.token._def);
    } catch {
      onClose();
    } finally {
      setIsWaitingComplete(false);
    }
  };

  if (isLoadingSubmitResult || isWaitingComplete) {
    return <UnnestStagesModal />;
  }

  return (
    <Modal
      title="Unnest"
      isVisible={true}
      footerButtons={
        <TransferBtn
          title="Confirm"
          disabled={feeLoading}
          role="primary"
          onClick={handleSubmit}
        />
      }
      onClose={onClose}
    >
      <p>
        This will disconnect your token from the parent NFT. All other nesting connections
        will remain intact.
      </p>
      <FeeWrapper>
        {feeLoading ? <Loader /> : <FeeInformationTransaction fee={feeFormatted} />}
      </FeeWrapper>
    </Modal>
  );
};

const FeeWrapper = styled.div`
  margin-top: calc(var(--prop-gap) * 1.5);
`;
