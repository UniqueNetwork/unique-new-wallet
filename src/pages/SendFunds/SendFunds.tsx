import React, { FC, useEffect, useMemo, VFC } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Loader, Text, useNotifications } from '@unique-nft/ui-kit';
import { useDebounce } from 'use-debounce';

import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { Account } from '@app/account';
import { Alert, Stages, TransferBtn, Modal } from '@app/components';
import { Chain, NetworkType, StageStatus } from '@app/types';
import { useAccountBalanceTransfer } from '@app/api';

import { ContentRow, ModalContent, ModalFooter } from '../components/ModalComponents';
import { SendFundsForm } from './SendFundsForm';
import { FeeLoader, TotalLoader } from './styles';
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

  const {
    fee,
    feeFormatted,
    feeLoading,
    feeStatus,
    feeError,
    isLoadingSubmitResult,
    getFee,
    submitWaitResult,
    submitWaitResultError,
  } = useAccountBalanceTransfer();

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

  const size = useDeviceSize();
  const { setCurrentChain } = useApi();
  const { info, error } = useNotifications();

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  useEffect(() => {
    setCurrentChain(chain);
  }, [chain, setCurrentChain]);

  useEffect(() => {
    if (isValid) {
      getFee({
        address: sendFundsDebounceValues.from?.address,
        destination: sendFundsDebounceValues.to?.address,
        amount: sendFundsDebounceValues.amount,
      });
    }
  }, [sendFundsDebounceValues]);

  const submitHandler = (sendFundsForm: FundsForm) => {
    submitWaitResult({
      payload: {
        address: sendFundsForm.from.address,
        destination: sendFundsForm.to.address,
        amount: sendFundsForm.amount,
      },
      senderAddress: sendFundsForm.from.address,
    })
      .then(() => {
        info('Transfer completed successfully');
        onSendSuccess?.();
        onClose();
      })
      .catch(() => {
        submitWaitResultError && error(submitWaitResultError);
      });
  };

  const total = useMemo(() => {
    const parsedFee = Number(fee);
    const parsedAmount = Number(sendFundsValues?.amount);

    if (parsedFee && parsedAmount) {
      return (parsedFee + parsedAmount).toFixed(3);
    }

    return 0;
  }, [sendFundsValues?.amount, fee]);

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
      {isLoadingSubmitResult ? (
        <TransferStagesModal />
      ) : (
        <Modal title="Send funds" isVisible={props.isVisible} onClose={onClose}>
          <ModalContent>
            {isolatedSendFundsForm}
            <ContentRow space="calc(var(--prop-gap) * 1.5)">
              <Alert type="warning">
                {feeLoading && (
                  <FeeLoader>
                    <Loader size="small" label="Calculating fee" placement="left" />
                  </FeeLoader>
                )}
                {!isValid && (
                  <Text color="inherit" size="s">
                    A fee will be calculated after entering the recipient and amount
                  </Text>
                )}
                {isValid && feeStatus === 'success' && (
                  <Text color="inherit" size="s">
                    {`A fee of ~ ${feeFormatted} can be applied to the transaction, unless the transaction
              is sponsored`}
                  </Text>
                )}
              </Alert>
            </ContentRow>
            {((sendFundsValues.amount && fee) || feeLoading) && (
              <ContentRow>
                {!feeLoading && isValid && <Text weight="light">Total ~ {total}</Text>}
                {feeLoading && (
                  <TotalLoader>
                    <Loader label="Calculating total" placement="left" />
                  </TotalLoader>
                )}
              </ContentRow>
            )}
          </ModalContent>
          <ModalFooter>
            <TransferBtn
              role="primary"
              title="Confirm"
              wide={size <= DeviceSize.sm}
              disabled={!isValid || feeLoading}
              onClick={handleSubmit(submitHandler)}
            />
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};
