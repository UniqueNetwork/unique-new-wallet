import { useMemo, VFC } from 'react';
import { InputText } from '@unique-nft/ui-kit';
import { Controller, useWatch } from 'react-hook-form';

import { Account } from '@app/account';
import { useAccounts } from '@app/hooks';
import { AccountSelect } from '@app/components';

import { ContentRow } from '../components/ModalComponents';
import { FundsForm } from './types';
import {
  Group,
  InputAmount,
  InputAmountButton,
  StyledAdditionalText,
} from './components/Style';

interface SendFundsFormProps {
  apiEndpoint: string;
}

export const SendFundsForm: VFC<SendFundsFormProps> = ({ apiEndpoint }) => {
  const { accounts } = useAccounts();

  const [to, from] = useWatch<FundsForm>({ name: ['to', 'from'] });

  const senders = useMemo(
    () => accounts.filter((acc) => acc.address !== (to as Account)?.address),
    [to],
  );
  const recipients = useMemo(
    () => accounts.filter((acc) => acc.address !== (from as Account)?.address),
    [from],
  );

  return (
    <>
      <ContentRow>
        <Group>
          <StyledAdditionalText size="s" color="grey-500">
            From
          </StyledAdditionalText>
          <Controller
            name="from"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <AccountSelect
                isClearable
                value={value}
                options={senders}
                isSearchable={false}
                placeholder="Select the sender"
                onChange={onChange}
              />
            )}
          />
        </Group>
        <Group>
          <StyledAdditionalText size="s" color="grey-500">
            To
          </StyledAdditionalText>
          <Controller
            name="to"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <AccountSelect
                isClearable
                isSearchable
                value={value}
                options={senders}
                placeholder="Select the recipient"
                onChange={onChange}
              />
            )}
          />
        </Group>
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
                // onChange={() => onChange(parseAmount(value))}
              />
              <InputAmountButton onClick={() => onChange(value || '')}>
                {/* {senderData ? 'Max' : <Loader size="small" />} */}
              </InputAmountButton>
            </InputAmount>
          )}
        />
      </ContentRow>
    </>
  );
};
