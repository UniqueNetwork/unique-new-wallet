import { useNavigate } from 'react-router-dom';

import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { useAccounts, useApi, useItemsLimit } from '@app/hooks';
import { useCheckExistTokensByAccount } from '@app/pages/hooks/useCheckExistTokensByAccount';
import { Token } from '@app/api/graphQL/types';
import List from '@app/components/List';
import { PagePaper } from '@app/components';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';
import { TokenNftLink } from '@app/pages/components/TokenNftLink';
import { MY_COLLECTIONS_ROUTE, ROUTE } from '@app/routes';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

export const NftList = ({ className, collectionId }: NftListComponentProps) => {
  const getLimit = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });
  const { search, direction, page, onChangePagination, type } = useNftFilterContext();
  const { selectedAccount } = useAccounts();
  const { currentChain } = useApi();
  const navigate = useNavigate();

  const { tokens, tokensCount, isLoadingTokens, isPagination, fetchMore } =
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
        panelSettings={{
          pagination: {
            current: page,
            pageSizes: [getLimit],
            show: isPagination,
            size: tokensCount,
            viewMode: 'bottom',
          },
          viewMode: 'both',
        }}
        renderItem={(token: Token) => (
          <TokenNftLink
            key={token.token_id}
            token={token}
            navigate={() => {
              navigate(
                `/${currentChain?.network}/token/${token.collection_id}/${token.token_id}`,
                {
                  state: {
                    backLink: `${ROUTE.MY_COLLECTIONS}/${token.collection_id}/${MY_COLLECTIONS_ROUTE.NFT}`,
                  },
                },
              );
            }}
          />
        )}
        visibleItems={getLimit}
        onPageChange={onChangePagination}
      />
    </PagePaper.Processing>
  );
};
