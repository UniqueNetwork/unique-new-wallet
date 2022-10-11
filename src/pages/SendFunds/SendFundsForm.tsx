import { useCallback, useContext, useMemo, VFC } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Text } from '@unique-nft/ui-kit';

import { Account } from '@app/account';
import { useAccounts } from '@app/hooks';
import { useAccountBalanceService } from '@app/api';
import { ChainPropertiesContext } from '@app/context';
import { AccountUtils } from '@app/account/AccountUtils';
import { AccountSelect, InputText } from '@app/components';

import { Group, InputAmount, InputAmountButton, StyledAdditionalText } from './styles';
import { ContentRow } from '../components/ModalComponents';
import { FundsForm } from './types';

interface SendFundsFormProps {
  apiEndpoint: string;
}

export const SendFundsForm: VFC<SendFundsFormProps> = ({ apiEndpoint }) => {
  const { accounts } = useAccounts();

  const { chainProperties } = useContext(ChainPropertiesContext);

  const [to, from] = useWatch<FundsForm>({ name: ['to', 'from'] });

  const { data: senderBalance } = useAccountBalanceService(
    (from as Account)?.address,
    apiEndpoint,
  );
  const { data: recipientBalance } = useAccountBalanceService(
    (to as Account)?.address,
    apiEndpoint,
  );

  const senders = useMemo(
    () => accounts.filter((acc) => acc.address !== (to as Account)?.address),
    [to],
  );
  const recipients = useMemo(
    () => accounts.filter((acc) => acc.address !== (from as Account)?.address),
    [from],
  );

  const parseAmount = useCallback(
    (currentAmount: string, prevAmount: string) => {
      const parsedAmount = Number(currentAmount);
      const parsedAvailableAmount = Number(senderBalance?.availableBalance.amount);

      if (isNaN(parsedAmount)) {
        currentAmount = currentAmount.replace(/[^\d.]/g, '');

        if (currentAmount.split('.').length > 2) {
          currentAmount = currentAmount.replace(/\.+$/, '');
        }
      }

      if (parsedAmount > parsedAvailableAmount) {
        currentAmount = prevAmount;
      }

      return currentAmount.trim();
    },
    [senderBalance?.availableBalance.amount],
  );

  const externalRecipientValidator = useCallback(
    (inputValue: string, selected: Account, options: Account[]) => {
      // this code hides an additional option
      // with suggestion to create an existing item
      if (options.find((opt) => opt.address.startsWith(inputValue))) {
        return false;
      }

      try {
        AccountUtils.encodeAddress(inputValue, chainProperties.SS58Prefix);

        return true;
      } catch {
        return false;
      }
    },
    [chainProperties],
  );

  return (
    <>
      <ContentRow>
        <Group>
          {/* bad realization, it should be common field component with the opportunity to change label position */}
          <StyledAdditionalText weight="light" size="s" color="grey-500">
            From
          </StyledAdditionalText>
          <Controller
            name="from"
            render={({ field: { value, onChange } }) => (
              <AccountSelect
                value={value}
                options={senders}
                placeholder="Select the sender"
                onChange={onChange}
              />
            )}
          />
          {senderBalance && (
            <Text size="s">
              {`${senderBalance?.availableBalance.amount} ${senderBalance?.availableBalance.unit}`}
            </Text>
          )}
        </Group>
        <Group>
          <StyledAdditionalText weight="light" size="s" color="grey-500">
            To
          </StyledAdditionalText>
          <Controller
            name="to"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <AccountSelect
                isSearchable
                value={value}
                options={recipients}
                placeholder="Select the recipient"
                isValidNewOption={externalRecipientValidator}
                onChange={onChange}
              />
            )}
          />
          {recipientBalance && (
            <Text size="s">
              {`${recipientBalance?.availableBalance.amount} ${recipientBalance?.availableBalance.unit}`}
            </Text>
          )}
        </Group>
      </ContentRow>
      <ContentRow space="calc(var(--prop-gap) * 1.5)">
        <Controller
          name="amount"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <InputAmount>
              <InputText
                role="decimal"
                value={value}
                placeholder="Enter the amount"
                onChange={(currentAmount) => onChange(parseAmount(currentAmount, value))}
              />
              <InputAmountButton
                disabled={!senderBalance}
                onClick={() => onChange(senderBalance?.availableBalance.amount || '')}
              >
                Max
              </InputAmountButton>
            </InputAmount>
          )}
        />
      </ContentRow>
    </>
  );
};
