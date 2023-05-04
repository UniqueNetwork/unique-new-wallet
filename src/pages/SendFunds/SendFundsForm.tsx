import { useCallback, useContext, useMemo, useState, VFC } from 'react';
import { GroupBase, Options, OptionsOrGroups } from 'react-select';
import { Controller, useWatch } from 'react-hook-form';
import { Address } from '@unique-nft/utils';
import styled from 'styled-components';

import { Account } from '@app/account';
import { useAccounts, useApi } from '@app/hooks';
import { useAccountBalanceService } from '@app/api';
import { ChainPropertiesContext } from '@app/context';
import { AccountSelect, InputText, Loader, Typography } from '@app/components';

import { Group, InputAmount, InputAmountButton, StyledAdditionalText } from './styles';
import { ContentRow } from '../components/ModalComponents';
import { FORM_ERRORS } from '../constants';

interface SendFundsFormProps {
  apiEndpoint: string;
}

export const SendFundsForm: VFC<SendFundsFormProps> = ({ apiEndpoint }) => {
  const { accounts } = useAccounts();
  const { api } = useApi();

  const { chainProperties } = useContext(ChainPropertiesContext);
  const [isCalculateMaxAmount, setIsCalculateMaxAmount] = useState(false);

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
      const parsedAmountValue = Number(currentAmount);

      if (isNaN(parsedAmountValue)) {
        currentAmount = currentAmount.replace(/[^\d.]/g, '');

        if (currentAmount.split('.').length > 2) {
          currentAmount = currentAmount.replace(/\.+$/, '');
        }
      }
      if (currentAmount.split('.')[1]?.length > 4) {
        currentAmount = Number(currentAmount).toFixed(4);
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

  const setMaxAmount = useCallback(
    (onChange: (value: string) => void) => async () => {
      if (!senderBalance || !recipientBalance) {
        onChange(senderBalance?.availableBalance.amount || '0');
        return;
      }
      try {
        setIsCalculateMaxAmount(true);
        const feeResponse = await api.balance.transfer.getFee({
          address: senderBalance?.address || '',
          destination: recipientBalance?.address || '',
          amount: Number(senderBalance?.availableBalance.amount) || 0,
        });

        const feeAmount = Number(feeResponse?.fee?.amount || 0);
        const balanceAmount = Number(senderBalance?.availableBalance.amount);

        const maxValue =
          feeAmount < balanceAmount ? balanceAmount - feeAmount : balanceAmount;

        onChange((((maxValue * 10000) | 0) / 10000).toFixed(4));
      } catch (e) {
        onChange(senderBalance?.availableBalance.amount || '0');
      } finally {
        setIsCalculateMaxAmount(false);
      }
    },
    [senderBalance, recipientBalance],
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
            <Typography size="s">
              {`${senderBalance?.availableBalance.amount} ${senderBalance?.availableBalance.unit}`}
            </Typography>
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
            <Typography size="s">
              {`${recipientBalance?.availableBalance.amount} ${recipientBalance?.availableBalance.unit}`}
            </Typography>
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
                maxLength={15}
                iconRight={
                  isCalculateMaxAmount ? (
                    <LoaderWrapper>
                      <Loader />
                    </LoaderWrapper>
                  ) : undefined
                }
                onChange={(currentAmount) => onChange(parseAmount(currentAmount, value))}
              />
              <InputAmountButton
                disabled={!senderBalance}
                onClick={setMaxAmount(onChange)}
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

const LoaderWrapper = styled.div`
  position: absolute;
  right: 58px;
  height: 24px;
`;
