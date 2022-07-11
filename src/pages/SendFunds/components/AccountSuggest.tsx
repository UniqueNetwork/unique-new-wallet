import { Suggest, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import classNames from 'classnames';

import { RecipientAddressType } from '@app/pages/SendFunds/SendFundsModal';
import { AccountInfo } from '@app/pages/SendFunds/components/AccountInfo';
import { AllBalancesResponse } from '@app/types/Api';

import DefaultAvatar from '../../../static/icons/default-avatar.svg';

type AccountSuggestType = {
  recipientOptions: RecipientAddressType[];
  recipient: RecipientAddressType | null;
  onRecipientAddress(value: string): void;
  onChangeRecipient(recipient: RecipientAddressType): void;
  balance?: AllBalancesResponse;
};

export const AccountSuggest = ({
  onRecipientAddress,
  recipientOptions,
  onChangeRecipient,
  recipient,
  balance,
}: AccountSuggestType) => {
  return (
    <>
      <SuggestWrapper>
        <Suggest
          inputProps={{
            iconLeft: {
              file: DefaultAvatar,
              size: 24,
            },
          }}
          suggestions={recipientOptions}
          getSuggestionValue={(suggestion) => suggestion.address}
          getActiveSuggestOption={(suggest, activeValue) =>
            suggest.address === activeValue.address
          }
          value={recipient || undefined}
          components={{
            SuggestItem: ({ suggestion, isActive }) => {
              return (
                <SuggestItem
                  className={classNames('suggestion-item', {
                    isActive,
                  })}
                >
                  <AccountInfo
                    address={suggestion.address}
                    key={suggestion.address}
                    name={suggestion.name}
                  />
                </SuggestItem>
              );
            },
          }}
          onChange={onChangeRecipient}
          onInputChange={onRecipientAddress}
        />
      </SuggestWrapper>
      <Text size="s">
        {balance?.availableBalance.amount} {balance?.availableBalance.unit}
      </Text>
    </>
  );
};

const SuggestItem = styled.div`
  & > div {
    padding: 0;
  }
`;

const SuggestWrapper = styled.div`
  .unique-suggestion,
  .suggest-input {
    display: block;
  }

  .input-wrapper {
    padding: calc(var(--prop-gap) / 2) var(--prop-gap);
    padding-right: 0;

    img {
      margin-right: var(--prop-gap);
    }
  }
`;
