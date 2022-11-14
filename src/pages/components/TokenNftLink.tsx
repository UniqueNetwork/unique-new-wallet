import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { Achievement, TokenLink } from '@app/components';
import { Token, TokenTypeEnum } from '@app/api/graphQL/types';

export const TokenNftLink = ({
  token,
  navigate,
}: {
  token: Token;
  navigate: () => void;
}) => {
  const renderBadge = (type: TokenTypeEnum) => {
    if (!token.parent_id && type === 'NESTED') {
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
    return null;
  };

  return (
    <TokenLink
      alt={token.token_name}
      image={token.image?.fullUrl || undefined}
      badge={renderBadge(token.type)}
      title={
        <>
          <Text appearance="block" size="l">
            {token.token_name}
          </Text>
          <Text appearance="block" weight="light" size="s">
            {token.collection_name} [id {token.collection_id}]
          </Text>
          {!token.parent_id && token.type === 'NESTED' && (
            <NestedWrapper>
              <Text appearance="block" weight="light" size="s" color="grey-500">
                Nested items: <span className="count">{token.children_count}</span>
              </Text>
            </NestedWrapper>
          )}
        </>
      }
      onTokenClick={() => navigate()}
    />
  );
};

const NestedWrapper = styled.div`
  margin-top: calc(var(--prop-gap) / 2);

  .count {
    color: var(--color-additional-dark);
  }
`;
