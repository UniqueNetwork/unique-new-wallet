import { useEffect, useMemo } from 'react';
import { useNotifications, Loader } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';

import { NFTModalsProps, UnnestStagesModal } from '@app/pages/NFTDetails/Modals';
import { Modal, TransferBtn } from '@app/components';
import { TNestingToken } from '@app/pages/NFTDetails/type';
import { useTokenUnnest } from '@app/api';
import { useAccounts } from '@app/hooks';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { queryKeys } from '@app/api/restApi/keysConfig';

export const UnnestModal = ({ onClose, token }: NFTModalsProps<TNestingToken>) => {
  const {
    getFee,
    feeFormatted,
    feeLoading,
    feeError,
    submitWaitResult,
    isLoadingSubmitResult,
    submitWaitResultError,
  } = useTokenUnnest();
  const { selectedAccount } = useAccounts();
  const { error, info } = useNotifications();
  const queryClient = useQueryClient();

  const unnestData = useMemo(() => {
    if (!token || !token.nestingParentToken || !selectedAccount) {
      return;
    }
    return {
      parent: { ...token.nestingParentToken },
      address: selectedAccount?.address,
      nested: {
        collectionId: token.collectionId,
        tokenId: token.tokenId,
      },
    };
  }, [selectedAccount, token]);

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

  const handleSubmit = () => {
    if (!unnestData) {
      return;
    }
    submitWaitResult({
      payload: unnestData,
    })
      .then(() => {
        onClose();

        info(`${token?.name} belongs to you now`);

        queryClient.invalidateQueries(queryKeys.token._def);
      })
      .catch(() => {
        onClose();
      });
  };

  if (isLoadingSubmitResult) {
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
