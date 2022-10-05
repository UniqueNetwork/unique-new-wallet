import React, { FC, useEffect, useMemo, VFC } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Heading, Modal, useNotifications } from '@unique-nft/ui-kit';
import { useDebounce } from 'use-debounce';

import { useApi } from '@app/hooks';
import { Account } from '@app/account';
import { Alert, Stages, TransferBtn } from '@app/components';
import { Chain, NetworkType, StageStatus } from '@app/types';
import { AccountApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';

import { SendFundsForm } from './SendFundsForm';
import { ModalHeader } from '../Accounts/Modals/commonComponents';
import { ContentRow, ModalContent, ModalFooter } from '../components/ModalComponents';
import { FundsForm } from './types';

export interface SendFundsProps {
  isVisible: boolean;
  networkType?: NetworkType;
  senderAccount?: Account;
  onClose: () => void;
  onSendSuccess?(): void;
  chain: Chain;
}

const stages = [
  {
    title: 'Transfer in progress',
    status: StageStatus.inProgress,
  },
];

const TransferStagesModal: VFC = () => {
  return (
    <Modal isVisible isClosable={false}>
      <Stages stages={stages} />
    </Modal>
  );
};

export const SendFunds: FC<SendFundsProps> = (props) => {
  const { onClose, senderAccount, onSendSuccess, chain } = props;

  const { setCurrentChain } = useApi();
  const { error, info } = useNotifications();

  const sendFundsForm = useForm<FundsForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      from: senderAccount,
    },
  });
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = sendFundsForm;
  const sendFundsValues = useWatch<FundsForm>({ control });
  const [sendFundsDebounceValues] = useDebounce(sendFundsValues as FundsForm, 500);

  const { isFlowLoading, flowError, flowStatus, signAndSubmitExtrinsic } =
    useExtrinsicFlow(AccountApiService.balanceTransfer, 'transfer-balance');
  const { isFeeError, feeError, feeFormatted, getFee } = useExtrinsicFee(
    AccountApiService.balanceTransfer,
  );

  useEffect(() => {
    setCurrentChain(chain);
  }, [chain, setCurrentChain]);

  useEffect(() => {
    if (isValid) {
      getFee({
        payload: {
          address: sendFundsDebounceValues.from?.address,
          destination: sendFundsDebounceValues.to?.address,
          amount: sendFundsDebounceValues.amount,
        },
      });
    }
  }, [sendFundsDebounceValues]);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('Transfer completed successfully');
      onSendSuccess?.();
      onClose();
    } else if (flowStatus === 'error') {
      error(flowError?.message);
    }
  }, [flowStatus]);

  useEffect(() => {
    if (isFeeError) {
      error(feeError?.message);
    }
  }, [isFeeError]);

  const submitHandler = (sendFundsForm: FundsForm) => {
    signAndSubmitExtrinsic(
      {
        payload: {
          address: sendFundsForm.from.address,
          destination: sendFundsForm.to.address,
          amount: sendFundsForm.amount,
        },
      },
      sendFundsForm.from.address,
    );
  };

  const isolatedSendFundsForm = useMemo(
    () => (
      <FormProvider {...sendFundsForm}>
        <SendFundsForm apiEndpoint={chain.apiEndpoint} />
      </FormProvider>
    ),
    [sendFundsForm],
  );

  return (
    <>
      {isFlowLoading ? (
        <TransferStagesModal />
      ) : (
        <Modal isVisible={props.isVisible} isClosable={true} onClose={onClose}>
          <ModalHeader>
            <Heading size="2">Send funds</Heading>
          </ModalHeader>
          <ModalContent>
            {isolatedSendFundsForm}
            <ContentRow>
              <Alert type="warning">
                {isValid && feeFormatted
                  ? `A fee of ~ ${feeFormatted} can be applied to the transaction, unless the transaction
              is sponsored`
                  : 'A fee will be calculated after entering the recipient and amount'}
              </Alert>
            </ContentRow>
          </ModalContent>
          <ModalFooter>
            <TransferBtn
              role="primary"
              title="Confirm"
              disabled={isValid}
              onClick={handleSubmit(submitHandler)}
            />
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};
