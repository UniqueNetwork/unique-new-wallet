import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  VFC,
} from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  Heading,
  Icon,
  InputText,
  Loader,
  Modal,
  Text,
} from '@unique-nft/ui-kit';
import styled, { css } from 'styled-components';

import { Account } from '@app/account';
import { NetworkType } from '@app/types';
import { formatAmount, networksUrls } from '@app/utils';
import { useAccounts } from '@app/hooks';
import { useAccountBalanceService } from '@app/api';
import {
  AdditionalText,
  ModalHeader,
  TextWarning,
} from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';

import { SendFundsProps } from './SendFunds';
import DefaultAvatar from '../../static/icons/default-avatar.svg';

export type SendFundsModalProps = SendFundsProps & {
  fee?: string;
  onConfirm: (senderAddress: string, destinationAddress: string, amount: number) => void;
  onAmountChange: (
    senderAddress: string,
    destinationAddress: string,
    amount: number,
  ) => void;
};

const parseAmount = (amount: string) => {
  if (isNaN(Number(amount))) {
    amount = amount.replace(/[^\d.]/g, '');

    if (amount.split('.').length > 2) {
      amount = amount.replace(/\.+$/, '');
    }
  }

  return amount.trim();
};

export const SendFundsModal: FC<SendFundsModalProps> = ({
  fee,
  senderAccount,
  networkType,
  isVisible,
  onClose,
  onConfirm,
  onAmountChange,
}) => {
  const { accounts, selectedAccount } = useAccounts();

  const [sender, setSender] = useState<Account | undefined>(
    senderAccount || selectedAccount,
  );
  const [recipient, setRecipient] = useState<Account | undefined>();
  const [amount, setAmount] = useState<string>('');

  const recipientOptions: Account[] = useMemo(
    () => accounts.filter(({ address }) => address !== sender?.address),
    [accounts, sender?.address],
  );
  const senderOptions: Account[] = useMemo(
    () => accounts.filter(({ address }) => address !== recipient?.address),
    [accounts, recipient?.address],
  );

  const { data } = useAccountBalanceService(
    sender?.address,
    networkType && networksUrls[networkType],
  );

  const amountChangeHandler = useCallback(
    (amount: string) => setAmount(parseAmount(amount)),
    [setAmount],
  );

  useLayoutEffect(() => {
    if (isVisible) {
      const body = document.getElementsByTagName('body')[0];

      body.style.overflow = 'hidden';

      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [isVisible]);

  useEffect(() => {
    if (sender?.address && recipient?.address && amount) {
      onAmountChange(sender.address, recipient.address, parseInt(amount));
    }
  }, [sender, recipient, amount, onAmountChange]);

  const confirm = () => {
    if (!sender?.address || !recipient?.address || !amount) {
      return;
    }

    onConfirm(sender?.address, recipient?.address, parseInt(amount));
  };

  if (!accounts?.length) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} isClosable={true} onClose={onClose}>
      <ModalHeader>
        <Heading size="2">Send funds</Heading>
      </ModalHeader>
      <ModalContent>
        <ContentRow>
          <Group>
            <StyledAdditionalText size="s" color="grey-500">
              From
            </StyledAdditionalText>
            <AccountSelector
              networkType={networkType}
              canCopy={!!senderOptions.length}
              selectOptions={senderOptions}
              selectedValue={sender}
              onChangeAccount={(value) => {
                setSender(value);
                setAmount('');
              }}
            />
          </Group>
          <Group>
            <StyledAdditionalText size="s" color="grey-500">
              To
            </StyledAdditionalText>
            <AccountSelector
              canCopy={!!recipientOptions.length}
              selectOptions={recipientOptions}
              selectedValue={recipient}
              onChangeAccount={(value) => {
                setRecipient(value);
                setAmount('');
              }}
            />
          </Group>
        </ContentRow>
        <ContentRow>
          <InputAmount>
            <InputText
              placeholder="Enter the amount"
              role="decimal"
              value={formatAmount(amount, '')}
              onChange={(value) => amountChangeHandler(value)}
            />
            <InputAmountButton
              onClick={() =>
                setAmount(
                  (data?.availableBalance.amount?.toString() || '').replace(/\D/g, ''),
                )
              }
            >
              {data ? 'Max' : <Loader size="small" />}
            </InputAmountButton>
          </InputAmount>
        </ContentRow>
        <ContentRow>
          <TextWarning color="additional-warning-500" size="s">
            {recipient && amount
              ? `A fee of ~ ${fee} ${networkType} can be applied to the transaction, unless the
                transaction is sponsored`
              : 'A fee will be calculated after entering the recipient and amount'}
          </TextWarning>
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <Button
          role="primary"
          title="Confirm"
          disabled={!amount || !sender?.address || !recipient?.address}
          onClick={confirm}
        />
      </ModalFooter>
    </Modal>
  );
};

const truncateText = css`
  box-sizing: border-box;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Group = styled.div`
  &:not(:first-child) {
    margin-top: var(--prop-gap);
  }

  & > .unique-text:not(:first-child) {
    display: block;
    margin-top: calc(var(--prop-gap) / 2);
    text-align: right;
  }
`;

const StyledAdditionalText = styled(AdditionalText)`
  margin-bottom: calc(var(--prop-gap) / 2);
`;

const AccountWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  width: 100%;

  .unique-text {
    display: inline-block;
    vertical-align: middle;
    ${truncateText};
    line-height: 1.5;
  }

  img {
    margin-right: var(--prop-gap);
  }
`;

const AccountGroup = styled.div`
  max-width: calc(100% - 40px);
  width: 100%;
`;

const AddressCopy = styled.button`
  appearance: none;
  border: 0 none;
  border-radius: 0;
  vertical-align: middle;
  padding: 0;
  color: inherit;
  background: none;
  cursor: pointer;

  &:hover {
    color: var(--color-grey-600);
  }
`;

const AccountAddress = styled.div`
  color: var(--color-grey-500);

  .unique-text {
    padding-right: 1.5rem;
  }

  ${AddressCopy} {
    margin-bottom: -0.2em;
    margin-left: -1rem;
  }
`;

const AccountContainer = styled.div`
  box-sizing: border-box;
  border-radius: var(--prop-border-radius);
  border: 1px solid var(--color-grey-300);
  position: relative;
  background-color: var(--color-additional-light);
`;

const AccountSelectWrapper = styled(AccountContainer)`
  padding-right: calc(var(--prop-gap) * 2.5);
  user-select: none;

  &:after {
    border-style: solid;
    border-width: 5px;
    border-color: var(--color-blue-grey-400) transparent transparent transparent;
    position: absolute;
    top: 50%;
    right: var(--prop-gap);
    width: 0;
    height: 0;
    content: '';
  }
`;

const AccountSelect = styled.div`
  .unique-dropdown {
    width: 100%;

    .dropdown-options,
    .dropdown-option {
      box-sizing: border-box;
      width: 100%;
      padding: 0;
      line-height: normal;
    }
  }
`;

const InputAmount = styled.div`
  position: relative;

  input[type='text'] {
    width: calc(100% - 76px);
  }
`;

const InputAmountButton = styled.button`
  border: 0;
  position: absolute;
  top: 50%;
  right: calc(var(--prop-gap) / 2);
  padding: calc(var(--prop-gap) / 2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: 0 transparent;
  line-height: 1;
  color: var(--color-primary-500);
  font: inherit;
  font-weight: 500;
  transform: translate3d(0, -50%, 0);
  cursor: pointer;
`;

const AccountInfo: VFC<{ name?: string; address?: string; canCopy?: boolean }> = ({
  name = '',
  address = '',
  canCopy,
}) => {
  const copyAddress = (address: string) => {
    void navigator.clipboard.writeText(address);
  };

  return (
    <AccountWrapper>
      <Avatar size={24} src={DefaultAvatar} />
      <AccountGroup>
        <Text>{name}</Text>
        <AccountAddress>
          <Text color="inherit" size="s">
            {address}
          </Text>
          {canCopy && (
            <AddressCopy onClick={() => copyAddress(address)}>
              <Icon size={14} name="copy" color="currentColor" />
            </AddressCopy>
          )}
        </AccountAddress>
      </AccountGroup>
    </AccountWrapper>
  );
};

const AccountSelector: FC<{
  canCopy?: boolean;
  networkType?: NetworkType;
  selectOptions: any;
  selectedValue?: Account;
  onChangeAccount?(value: Account): void;
}> = ({ canCopy = true, networkType, selectedValue, selectOptions, onChangeAccount }) => {
  const { data } = useAccountBalanceService(
    selectedValue?.address,
    networkType && networksUrls[networkType],
  );

  return (
    <>
      <AccountSelect>
        <Dropdown
          value={selectedValue?.address}
          options={selectOptions || []}
          optionKey="address"
          optionRender={(option: any) => (
            <AccountInfo
              address={option.address}
              key={option.address}
              name={option.meta.name}
            />
          )}
          onChange={onChangeAccount as any}
        >
          <AccountSelectWrapper>
            <AccountInfo
              address={selectedValue?.address}
              name={selectedValue?.meta.name}
              canCopy={canCopy}
            />
          </AccountSelectWrapper>
        </Dropdown>
      </AccountSelect>
      <Text size="s">
        {data?.availableBalance.amount} {data?.availableBalance.unit}
      </Text>
    </>
  );
};
