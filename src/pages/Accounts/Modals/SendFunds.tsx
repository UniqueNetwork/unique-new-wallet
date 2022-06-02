import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Heading, InputText, Modal, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { useAccounts } from '@app/hooks';
import { SelectInput } from '@app/components/SelectInput/SelectInput';
import { Account } from '@app/account';
import { formatKusamaBalance } from '@app/utils/textUtils';

import DefaultAvatar from '../../../static/icons/default-avatar.svg';

const tokenSymbol = 'KSM';

export type TransferFundsModalProps = {
  isVisible: boolean;
  senderAddress?: string;
  onFinish(): void;
};

export const TransferFundsModal: FC<TransferFundsModalProps> = ({
  isVisible,
  senderAddress,
  onFinish,
}) => {
  const [status, setStatus] = useState<'ask' | 'transfer-stage'>('ask');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const onTransfer = useCallback(
    (_sender: string, _recipient: string, _amount: string) => {
      setRecipient(_recipient);
      setAmount(_amount);
    },
    [setStatus, setRecipient, setAmount],
  );

  return (
    <AskTransferFundsModal
      isVisible={isVisible}
      senderAddress={senderAddress || ''}
      onFinish={onTransfer}
      onClose={onFinish}
    />
  );
};

type AskSendFundsModalProps = {
  isVisible: boolean;
  senderAddress: string;
  onFinish(sender: string, recipient: string, amount: string): void;
  onClose(): void;
};

export const AskTransferFundsModal: FC<AskSendFundsModalProps> = ({
  isVisible,
  onFinish,
  senderAddress,
  onClose,
}) => {
  const { accounts } = useAccounts();

  const [recipientAddress, setRecipientAddress] = useState<
    string | Account | undefined
  >();
  const [amount, setAmount] = useState<number>(0);

  const senderBalance = useMemo(() => {
    return '';
  }, []);

  const recipientBalance = useMemo(() => {
    return '';
  }, []);

  const onAmountChange = useCallback(
    (value: string) => {
      setAmount(Number(value));
    },
    [setAmount],
  );

  const onSend = useCallback(() => {
    const recipient =
      typeof recipientAddress === 'string' ? recipientAddress : recipientAddress?.address;

    onFinish(senderAddress, recipient || '', amount.toString());
  }, [recipientAddress, onFinish, senderAddress, amount]);

  if (!accounts?.length) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} isClosable={true} onClose={onClose}>
      <Content>
        <Heading size="2">Send funds</Heading>
      </Content>

      <Text size="s" color="grey-500">
        From
      </Text>
      <AddressWrapper>
        <Avatar size={24} src={DefaultAvatar} />
        <Text>{senderAddress || ''}</Text>
      </AddressWrapper>
      <AmountWrapper>
        <Text size="s">{`${formatKusamaBalance(
          senderBalance?.toString() || 0,
        )} ${tokenSymbol}`}</Text>
      </AmountWrapper>

      <Text size="s" color="grey-500">
        To
      </Text>
      <RecipientSelectWrapper>
        <SelectInput<Account>
          options={accounts}
          value={recipientAddress}
          renderOption={(option) => (
            <AddressOptionWrapper>
              <Avatar size={24} src={DefaultAvatar} />
              <Text>{option?.address || ''}</Text>
            </AddressOptionWrapper>
          )}
          onChange={setRecipientAddress}
        />
      </RecipientSelectWrapper>
      <AmountWrapper>
        {recipientBalance && (
          <Text size="s">{`${formatKusamaBalance(
            recipientBalance?.toString() || 0,
          )} ${tokenSymbol}`}</Text>
        )}
      </AmountWrapper>
      <AmountInputWrapper>
        <InputText value={amount.toString()} onChange={onAmountChange} />
      </AmountInputWrapper>
      <TextStyled color="additional-warning-500" size="s">
        A fee of ~ 0.000000000000052 testUNQ can be applied to the transaction, unless the
        transaction is sponsored
      </TextStyled>
      <ButtonWrapper>
        <Button
          // disabled={!validPassword || !password || !name}
          role="primary"
          title="Confirm"
          onClick={onSend}
        />
      </ButtonWrapper>
    </Modal>
  );
};

const Content = styled.div`
  && h2 {
    margin-bottom: 0;
  }
`;

const AddressWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
  margin-top: calc(var(--prop-gap) * 2);
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  padding: 20px var(--prop-gap);
`;

const AddressOptionWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
`;

const TextStyled = styled(Text)`
  box-sizing: border-box;
  display: flex;
  padding: 8px 16px;
  margin: calc(var(--prop-gap) * 1.5) 0;
  border-radius: 4px;
  background-color: var(--color-additional-warning-100);
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: var(--prop-gap);
`;

const RecipientSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--prop-gap) / 2);
  margin-bottom: calc(var(--prop-gap) * 1.5);
  .unique-input-text {
    width: 100%;
  }
`;

const AmountWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AmountInputWrapper = styled.div`
  .unique-input-text {
    width: 100%;
  }
`;
