import { useCallback, useContext, useMemo, VFC } from 'react';
import { GroupBase, Options, OptionsOrGroups } from 'react-select';
import { Controller, useWatch } from 'react-hook-form';
import { Text } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils';

import { Account } from '@app/account';
import { useAccounts } from '@app/hooks';
import { useAccountBalanceService } from '@app/api';
import { ChainPropertiesContext } from '@app/context';
import { AccountSelect, InputText } from '@app/components';

import { Group, InputAmount, InputAmountButton, StyledAdditionalText } from './styles';
import { ContentRow } from '../components/ModalComponents';
import { FORM_ERRORS } from '../constants';

interface SendFundsFormProps {
  apiEndpoint: string;
}

export const SendFundsForm: VFC<SendFundsFormProps> = ({ apiEndpoint }) => {
  const { accounts } = useAccounts();

  const { chainProperties } = useContext(ChainPropertiesContext);

  const [to, from] = useWatch({
    name: ['to', 'from'],
  });

  const { data: senderBalance } = useAccountBalanceService(from?.address, apiEndpoint);
  const { data: recipientBalance } = useAccountBalanceService(to?.address, apiEndpoint);

  const senders = useMemo(
    () => new Map([...accounts].filter(([_, value]) => value.address !== to?.address)),
    [to],
  );
  const recipients = useMemo(
    () => new Map([...accounts].filter(([_, value]) => value.address !== from?.address)),
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
    (
      inputValue: string,
      selected: Options<Account>,
      options: OptionsOrGroups<Account, GroupBase<Account>>,
    ) => {
      // this code hides an additional option
      // with suggestion to create an existing item
      if (
        options.find((opt) =>
          (opt as Account)?.address.toLowerCase().startsWith(inputValue.toLowerCase()),
        ) ||
        from?.address.toLowerCase() === inputValue.toLocaleLowerCase()
      ) {
        return false;
      }

      if (Address.is.validAddressInAnyForm(inputValue)) {
        return true;
      }
      return false;
    },
    [chainProperties, from],
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
            rules={{ required: { value: true, message: FORM_ERRORS.REQUIRED_FIELDS } }}
            render={({ field: { value, onChange } }) => (
              <AccountSelect
                value={value}
                options={[...senders.values()]}
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
            rules={{ required: { value: true, message: FORM_ERRORS.REQUIRED_FIELDS } }}
            render={({ field: { value, onChange } }) => (
              <AccountSelect
                isSearchable
                value={value}
                options={[...recipients.values()]}
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
          rules={{
            required: { value: true, message: FORM_ERRORS.REQUIRED_FIELDS },
            validate: (value) => (value <= 0 ? FORM_ERRORS.INVALID_AMOUNT : true),
          }}
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
