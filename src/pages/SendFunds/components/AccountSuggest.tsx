import { Suggest, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import classNames from 'classnames';

import { RecipientAddressType } from '@app/pages/SendFunds/SendFundsModal';
import { AccountInfo } from '@app/pages/SendFunds/components/AccountInfo';
import { AllBalancesResponse } from '@app/types/Api';

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
  .unique-suggestion-wrapper {
    width: 100%;
  }

  .unique-suggestion,
  .suggest-input {
    display: block;
  }

  .unique-suggestion {
    .icon-right-wrapper {
      height: 100%;
    }

    .suggestion-values {
      box-shadow: 0 4px 16px rgb(0 0 0 / 16%);
      border: 1px solid transparent;
      padding: 0;

      & > div {
        & > div {
          &:not(:last-child) {
            margin-bottom: 3px;
          }
        }
      }
    }

    .suggestion-item {
      padding-left: var(--prop-gap);
    }
  }

  .suggest-input {
    .suggest-active-value {
      height: auto;
      padding-left: 0;

      .suggestion-item {
        padding-left: var(--prop-gap);
      }
    }
  }

  .input-wrapper {
    height: calc(61px - var(--prop-gap));
    padding: calc(var(--prop-gap) / 2) var(--prop-gap) calc(var(--prop-gap) / 2)
      calc(var(--prop-gap) * 2.125);
  }
`;
