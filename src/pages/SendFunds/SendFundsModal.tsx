import { FC, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Heading, InputText, Loader, Modal } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import { useAccounts } from '@app/hooks';
import { ModalHeader } from '@app/pages/Accounts/Modals/commonComponents';
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
import { ChainPropertiesContext } from '@app/context';
import { AccountUtils } from '@app/account/AccountUtils';

import { SendFundsProps } from './SendFunds';
// import { SendFundsForm } from './types';

export type RecipientAddressType = {
  address: Account['address'];
  name: Account['meta']['name'];
};

export type SendFundsModalProps = SendFundsProps & {
  fee?: string;
  onConfirm: (form: any) => void;
};

export const SendFundsModal: FC<SendFundsModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  chain,
}) => {
  const { chainProperties } = useContext(ChainPropertiesContext);

  const { accounts } = useAccounts();

  // const parseAmount = useCallback(
  //   (changedAmount: string) => {
  //     const parsedAmount = Number(changedAmount);
  //     const parsedAvailableAmount = Number(senderData?.availableBalance.amount);

  //     if (isNaN(parsedAmount)) {
  //       changedAmount = changedAmount.replace(/[^\d.]/g, '');

  //       if (changedAmount.split('.').length > 2) {
  //         changedAmount = changedAmount.replace(/\.+$/, '');
  //       }
  //     }

  //     if (parsedAmount > parsedAvailableAmount) {
  //       changedAmount = amount;
  //     }

  //     return changedAmount.trim();
  //   },
  //   [amount, senderData?.availableBalance.amount],
  // );

  useLayoutEffect(() => {
    if (isVisible) {
      const body = document.getElementsByTagName('body')[0];

      body.style.overflow = 'hidden';

      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [isVisible]);

  // const handleRecipientAddress = (address: string) => {
  //   try {
  //     if (!address) {
  //       return null;
  //     }

  //     const transformAddressForCurrentChain = AccountUtils.encodeAddress(
  //       address,
  //       chainProperties.SS58Prefix,
  //     );
  //     const addressIsExist = recipientOptions.find(
  //       (recipient) => recipient.address === address,
  //     );
  //     if (!addressIsExist) {
  //       setRecipientOptions((prevState) => [
  //         ...prevState,
  //         {
  //           address: transformAddressForCurrentChain,
  //           name: transformAddressForCurrentChain,
  //         },
  //       ]);
  //     }
  //     return {
  //       address: transformAddressForCurrentChain,
  //       name: addressIsExist?.name ?? transformAddressForCurrentChain,
  //     };
  //   } catch {
  //     return null;
  //   }
  // };

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
            {/* <Controller
              name="from"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <AccountSelector
                  apiEndpoint={chain.apiEndpoint}
                  canCopy={false}
                  selectOptions={[]}
                  selectedValue={value}
                  onChangeAccount={(value) => {
                    onChange(value);
                    // setAmount('');
                  }}
                />
              )}
            /> */}
          </Group>
          {/* <Group>
            <StyledAdditionalText size="s" color="grey-500">
              To
            </StyledAdditionalText>
            <Controller
              name="to"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <AccountSuggest
                  recipient={value}
                  recipientOptions={[]}
                  apiEndpoint={chain.apiEndpoint}
                  onRecipientAddress={(address: string) => {
                    // onChange(handleRecipientAddress(address))
                    console.log('test');
                  }
              )}
            />
          </Group> */}
        </ContentRow>
        <ContentRow>
          <Controller
            name="amount"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <InputAmount>
                <InputText
                  placeholder="Enter the amount"
                  role="decimal"
                  value={value}
                  onChange={onChange}
                />
                <InputAmountButton onClick={() => onChange(value || '')}>
                  {/* {senderData ? 'Max' : <Loader size="small" />} */}
                </InputAmountButton>
              </InputAmount>
            )}
          />
        </ContentRow>
      </ModalContent>
    </Modal>
  );
};
