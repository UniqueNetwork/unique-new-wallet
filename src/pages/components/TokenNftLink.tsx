import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';
import { Address } from '@unique-nft/utils';

import { Achievement, TokenLink } from '@app/components';
import { Token, TokenTypeEnum } from '@app/api/graphQL/types';
import { formatLongNumber, shortAddress } from '@app/utils';
import { useIsOwner } from '@app/hooks/useIsOwner';

export const TokenNftLink = ({
  token,
  navigate,
  showOwner,
  checkNesting,
}: {
  token: Token;
  navigate: () => void | string;
  showOwner?: boolean;
  checkNesting?: boolean;
}) => {
  const renderBadge = (type: TokenTypeEnum, nested: boolean) => {
    if (!token.parent_id && nested) {
      return (
        <Achievement
          achievement="Bundle"
          tooltipDescription={
            <>
              A&nbsp;group of&nbsp;tokens nested in&nbsp;an&nbsp;NFT and having
              a&nbsp;nested, ordered, tree-like structure
            </>
          }
        />
      );
    }
    if (type === 'RFT') {
      return (
        <Achievement
          achievement="Fractional"
          tooltipDescription={
            <>
              A&nbsp;fractional token provides a&nbsp;way for many users to&nbsp;own
              a&nbsp;part of&nbsp;an&nbsp;NFT
            </>
          }
        />
      );
    }
    return null;
  };

  const isOwner = useIsOwner(
    {
      collectionId: token.collection_id,
      tokenId: token.token_id,
      owner: token.tokens_owner,
      collection: {
        mode: token.type === 'NFT' ? 'NFT' : 'ReFungible',
      },
      amount: token.tokens_amount,
    },
    token.tokens_owner,
    { checkNesting },
  );

  return (
    <TokenLink
      alt={token.token_name}
      image={token.image?.fullUrl || undefined}
      badge={renderBadge(token.type, token.nested)}
      title={
        <>
          <Text appearance="block" size="l">
            {token.token_name}
          </Text>
          <Text appearance="block" weight="light" size="s">
            {token.collection_name} [id {token.collection_id}]
          </Text>
          {!token.parent_id && token.nested && (
            <AdditionalWrapper>
              <Text appearance="block" weight="light" size="s" color="grey-500">
                Nested items: <span className="count">{token.children_count}</span>
              </Text>
            </AdditionalWrapper>
          )}
          {token.type === TokenTypeEnum.RFT && (
            <AdditionalWrapper>
              <Text appearance="block" weight="light" size="s" color="grey-500">
                Owned fractions:{' '}
                <span className="count">
                  {formatLongNumber(Number(token.tokens_amount))}/
                  {formatLongNumber(Number(token.total_pieces))}
                </span>
              </Text>
            </AdditionalWrapper>
          )}
          {showOwner && (
            <AdditionalWrapper>
              {isOwner && (
                <Text appearance="block" weight="light" size="s" color="grey-500">
                  You own it
                </Text>
              )}
              {!isOwner && (
                <Text appearance="block" weight="light" size="s" color="grey-500">
                  {Address.is.nestingAddress(token.tokens_owner)
                    ? 'Nested in'
                    : 'Owned by:'}{' '}
                  <span className="count">{shortAddress(token.tokens_owner)}</span>
                </Text>
              )}
            </AdditionalWrapper>
          )}
        </>
      }
      onTokenClick={() => navigate()}
    />
  );
};

const AdditionalWrapper = styled.div`
  margin-top: calc(var(--prop-gap) / 2);

  .count {
    white-space: nowrap;
    color: var(--color-additional-dark);
  }
`;
