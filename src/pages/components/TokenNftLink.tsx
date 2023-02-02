import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { Achievement, TokenLink } from '@app/components';
import { Token, TokenTypeEnum } from '@app/api/graphQL/types';
import { formatBlockNumber } from '@app/utils';

export const TokenNftLink = ({
  token,
  navigate,
}: {
  token: Token;
  navigate: () => void;
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
                  {formatBlockNumber(token.tokens_amount)}/
                  {formatBlockNumber(token.total_pieces)}
                </span>
              </Text>
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
    color: var(--color-additional-dark);
  }
`;
