import styled from 'styled-components';
import { Address } from '@unique-nft/utils';

import { TokenLinkBase, Typography } from '@app/components';
import { Token, TokenTypeEnum } from '@app/api/graphQL/types';
import { formatLongNumber, shortAddress } from '@app/utils';
import { useIsOwner } from '@app/hooks/useIsOwner';
import { useApi } from '@app/hooks';

import { Achievement } from '../../components/Achievement';
import {
  AngelHackBaseCollectionId,
  AngelHackWearablesCollectionId,
} from '../MyTokens/constants';

export const TokenLink = ({
  token,
  showOwner,
  checkNesting,
  link,
  state,
}: {
  token: Token;
  link: string;
  state?: unknown;
  showOwner?: boolean;
  checkNesting?: boolean;
}) => {
  const { currentChain } = useApi();

  const renderBadge = (type: TokenTypeEnum, nested: boolean) => {
    if (token.collection_id === AngelHackBaseCollectionId[currentChain.network]) {
      return (
        <>
          <Achievement achievement="Base NFT" tooltipDescription={null} />
          <AchievementSecondary achievement="Soulbound" tooltipDescription={null} />
        </>
      );
    }
    if (token.collection_id === AngelHackWearablesCollectionId[currentChain.network]) {
      return (
        <>
          <Achievement achievement="Wearables" tooltipDescription={null} />
        </>
      );
    }
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
    <TokenLinkBase
      link={link}
      state={state}
      alt={token.token_name}
      image={token.image?.fullUrl || undefined}
      badge={renderBadge(token.type, token.nested)}
      title={
        <>
          <Typography appearance="block" size="l">
            {token.token_name}
          </Typography>
          <Typography appearance="block" weight="light" size="s">
            {token.collection_name} [id {token.collection_id}]
          </Typography>
          {!token.parent_id && token.nested && (
            <AdditionalWrapper>
              <Typography appearance="block" weight="light" size="s" color="grey-500">
                Nested items: <span className="count">{token.children_count}</span>
              </Typography>
            </AdditionalWrapper>
          )}
          {token.type === TokenTypeEnum.RFT && (
            <AdditionalWrapper>
              <Typography appearance="block" weight="light" size="s" color="grey-500">
                Owned fractions:{' '}
                <span className="count">
                  {formatLongNumber(Number(token.tokens_amount))}/
                  {formatLongNumber(Number(token.total_pieces))}
                </span>
              </Typography>
            </AdditionalWrapper>
          )}
          {showOwner && (
            <AdditionalWrapper>
              {isOwner && (
                <Typography appearance="block" weight="light" size="s" color="grey-500">
                  You own it
                </Typography>
              )}
              {!isOwner && (
                <Typography appearance="block" weight="light" size="s" color="grey-500">
                  {Address.is.nestingAddress(token.tokens_owner)
                    ? 'Nested in'
                    : 'Owned by:'}{' '}
                  <span className="count">{shortAddress(token.tokens_owner)}</span>
                </Typography>
              )}
            </AdditionalWrapper>
          )}
        </>
      }
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

const AchievementSecondary = styled(Achievement)`
  top: calc(var(--gap) + 32px);
`;
