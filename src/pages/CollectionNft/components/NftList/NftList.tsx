import { useNavigate } from 'react-router-dom';
import { Text } from '@unique-nft/ui-kit';

import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { useAccounts, useItemsLimit } from '@app/hooks';
import { useCheckExistTokensByAccount } from '@app/pages/hooks/useCheckExistTokensByAccount';
import { Token } from '@app/api/graphQL/types';
import List from '@app/components/List';
import { PagePaper } from '@app/components';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';
import { TokenNftLink } from '@app/pages/components/TokenNftLink';
import { MY_COLLECTIONS_ROUTE, ROUTE } from '@app/routes';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';
import { useGraphQlGetCollectionTokensOwners } from '@app/api/graphQL/tokens/useGraphQlGetCollectionTokensOwners';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

export const NftList = ({ className, collectionId }: NftListComponentProps) => {
  const getLimit = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });
  const { search, direction, page, onChangePagination, type } = useNftFilterContext();
  const { selectedAccount } = useAccounts();
  const navigate = useNavigate();
  const getTokenPath = useGetTokenPath();

  const { tokenOwnersCount, isPagination } = useGraphQlGetCollectionTokensOwners({
    collectionId: parseInt(collectionId || ''),
    collectionOwner: selectedAccount?.address,
    filter: {
      search,
      type,
    },
    options: {
      skip: !selectedAccount?.address,
      pagination: {
        page,
        limit: getLimit,
      },
    },
  });

  const { tokens, tokensCount, isLoadingTokens, fetchMore, refetchCollectionTokens } =
    useGraphQlCollectionTokens({
      collectionId: parseInt(collectionId || ''),
      collectionOwner: selectedAccount?.address,
      filter: {
        search,
        type,
      },
      options: {
        skip: !selectedAccount?.address,
        direction,
        pagination: {
          page,
          limit: getLimit,
        },
      },
    });

  const { cacheTokens } = useCheckExistTokensByAccount({
    tokens,
    collectionId: parseInt(collectionId),
    refetchTokens: refetchCollectionTokens,
  });

  return (
    <PagePaper.Processing>
      <ListEntitiesCache entities={cacheTokens} />
      <List
        className={className}
        dataSource={tokens}
        fetchMore={fetchMore}
        isLoading={isLoadingTokens}
        itemCols={{ sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
        resultsComponent={
          <Text>
            {tokenOwnersCount} unique elements, {tokensCount} tokens
          </Text>
        }
        panelSettings={{
          pagination: {
            current: page,
            pageSizes: [getLimit],
            show: isPagination,
            size: tokenOwnersCount,
            viewMode: 'bottom',
          },
          viewMode: 'both',
        }}
        renderItem={(token: Token) => (
          <TokenNftLink
            showOwner
            key={`${token.tokens_owner}-${token.token_id}`}
            token={token}
            navigate={() => {
              navigate(getTokenPath(token.owner, token.collection_id, token.token_id), {
                state: {
                  backLink: `${ROUTE.MY_COLLECTIONS}/${token.collection_id}/${MY_COLLECTIONS_ROUTE.NFT}`,
                },
              });
            }}
          />
        )}
        visibleItems={getLimit}
        onPageChange={onChangePagination}
      />
    </PagePaper.Processing>
  );
};
