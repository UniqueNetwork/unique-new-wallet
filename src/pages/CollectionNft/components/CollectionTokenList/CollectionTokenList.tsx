import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { useAccounts, useItemsLimit } from '@app/hooks';
import { useCheckExistTokensByAccount } from '@app/hooks/useCheckExistTokensByAccount';
import { Token } from '@app/api/graphQL/types';
import { PagePaper, Typography, List } from '@app/components';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';
import { TokenLink } from '@app/pages/components/TokenLink';
import { MY_COLLECTIONS_ROUTE, ROUTE } from '@app/routes';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';
import { useGraphQlGetCollectionTokensOwners } from '@app/api/graphQL/tokens/useGraphQlGetCollectionTokensOwners';
import { NothingToDisplay } from '@app/pages/components/NothingToDisplay';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';

interface CollectionTokenListComponentProps {
  className?: string;
  collectionId: string;
}

export const CollectionTokenList = ({
  className,
  collectionId,
}: CollectionTokenListComponentProps) => {
  const { limit } = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });
  const { collection } = useCollectionContext() || {};
  const { search, direction, page, onPageChange, onPageSizeChange, type } =
    useNftFilterContext();
  const { selectedAccount } = useAccounts();
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
        limit,
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
        sort: { token_id: direction },
        pagination: {
          page,
          limit,
        },
      },
    });

  const { cacheTokens } = useCheckExistTokensByAccount({
    tokens,
    collectionId: parseInt(collectionId),
    refetchTokens: refetchCollectionTokens,
  });

  const getTotalResults = () => {
    const elementsTitle = tokenOwnersCount > 1 ? 'unique elements' : 'unique element';
    const tokensTitle = tokensCount > 1 ? 'tokens' : 'token';

    if (collection?.mode === 'NFT') {
      return `${tokensCount} ${tokensTitle}`;
    }
    return `${tokenOwnersCount} ${elementsTitle}, ${tokensCount} ${tokensTitle}`;
  };

  return (
    <PagePaper.Processing>
      <ListEntitiesCache entities={cacheTokens} />
      <List
        className={className}
        dataSource={tokens}
        fetchMore={fetchMore}
        isLoading={isLoadingTokens}
        itemCols={{ sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
        resultsComponent={<Typography>{getTotalResults()}</Typography>}
        panelSettings={{
          pagination: {
            current: page,
            pageSizes: [limit],
            show: isPagination,
            size: tokenOwnersCount,
            viewMode: 'bottom',
          },
          viewMode: 'both',
        }}
        noItemsIconName={type !== 'all' || search ? 'magnifier-found' : 'not-found'}
        noItemsTitle={type !== 'all' || search ? 'Nothing found' : <NothingToDisplay />}
        renderItem={(token: Token) => (
          <TokenLink
            showOwner
            link={getTokenPath(token.tokens_owner, token.collection_id, token.token_id)}
            state={{
              backLink: `${ROUTE.MY_COLLECTIONS}/${token.collection_id}/${MY_COLLECTIONS_ROUTE.NFT}`,
            }}
            key={`${token.tokens_owner}-${token.token_id}`}
            token={token}
          />
        )}
        visibleItems={limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </PagePaper.Processing>
  );
};
