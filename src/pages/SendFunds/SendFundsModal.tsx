import { FC, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Heading, InputText, Loader, Modal } from '@unique-nft/ui-kit';
import { keyring } from '@polkadot/ui-keyring';

import { Account } from '@app/account';
import { formatAmount } from '@app/utils';
import { useAccounts } from '@app/hooks';
import { useAccountBalanceService } from '@app/api';
import { ModalHeader, TextWarning } from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import {
  Group,
  InputAmount,
  InputAmountButton,
  StyledAdditionalText,
} from '@app/pages/SendFunds/components/Style';
import { AccountSelector } from '@app/pages/SendFunds/components/AccountSelector';
import { AccountSuggest } from '@app/pages/SendFunds/components/AccountSuggest';
import { ChainPropertiesContext } from '@app/context';
import { TransferBtn } from '@app/components';

import { SendFundsProps } from './SendFunds';

export type RecipientAddressType = {
  address: Account['address'];
  name: Account['meta']['name'];
};

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
  chain,
}) => {
  const { chainProperties } = useContext(ChainPropertiesContext);

  const { accounts, selectedAccount } = useAccounts();

  const [sender, setSender] = useState<Account | undefined>(
    senderAccount || selectedAccount,
  );
  const [recipientOptions, setRecipientOptions] = useState<RecipientAddressType[]>([]);
  const [recipient, setRecipient] = useState<RecipientAddressType | null>(null);
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    setRecipientOptions(
      accounts
        .filter(({ address }) => address !== sender?.address)
        .map(({ address, meta: { name } }) => ({ address, name })),
    );
  }, [accounts, sender?.address]);

  const senderOptions: Account[] = useMemo(
    () => accounts.filter(({ address }) => address !== recipient?.address),
    [accounts, recipient?.address],
  );

  const { data: senderData } = useAccountBalanceService(
    sender?.address,
    chain.apiEndpoint,
  );

  const { data: chainData } = useAccountBalanceService(
    recipient?.address,
    chain.apiEndpoint,
  );

  const amountChangeHandler = (amount: string) => setAmount(parseAmount(amount));

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
  }, [sender?.address, recipient?.address, amount]);

  const confirm = () => {
    if (!sender?.address || !recipient?.address || !amount) {
      return;
    }

    onConfirm(sender?.address, recipient?.address, parseInt(amount));
  };

  const handleRecipientAddress = (address: string) => {
    try {
      if (!address) {
        setRecipient(null);
        return;
      }

      const transformAddressForCurrentChain = keyring.encodeAddress(
        keyring.decodeAddress(address),
        chainProperties.SS58Prefix,
      );
      const addressIsExist = recipientOptions.find(
        (recipient) => recipient.address === address,
      );
      if (!addressIsExist) {
        setRecipientOptions((prevState) => [
          ...prevState,
          {
            address: transformAddressForCurrentChain,
            name: transformAddressForCurrentChain,
          },
        ]);
      }
      setRecipient({
        address: transformAddressForCurrentChain,
        name: addressIsExist?.name ?? transformAddressForCurrentChain,
      });
    } catch {
      setRecipient(null);
    }
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
              canCopy={!!senderOptions.length}
              selectOptions={senderOptions}
              selectedValue={sender}
              balance={senderData}
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
            <AccountSuggest
              recipientOptions={recipientOptions}
              recipient={recipient}
              balance={chainData}
              onRecipientAddress={handleRecipientAddress}
              onChangeRecipient={setRecipient}
            />
          </Group>
        </ContentRow>
        <ContentRow>
          <InputAmount>
            <InputText
              placeholder="Enter the amount"
              role="decimal"
              value={formatAmount(amount, '')}
              onChange={amountChangeHandler}
            />
            <InputAmountButton
              onClick={() =>
                setAmount(
                  (senderData?.availableBalance.amount?.toString() || '').replace(
                    /\D/g,
                    '',
                  ),
                )
              }
            >
              {senderData ? 'Max' : <Loader size="small" />}
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
        <TransferBtn
          role="primary"
          title="Confirm"
          disabled={!amount || !sender?.address || !recipient?.address}
          onClick={confirm}
        />
      </ModalFooter>
    </Modal>
  );
};
