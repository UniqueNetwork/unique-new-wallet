import { useNavigate } from 'react-router-dom';
import { Text } from '@unique-nft/ui-kit';

import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { useAccounts, useApi, useItemsLimit } from '@app/hooks';
import { useCheckExistTokensByAccount } from '@app/pages/hooks/useCheckExistTokensByAccount';
import { Token } from '@app/api/graphQL/types';
import List from '@app/components/List';
import { PagePaper, TokenLink } from '@app/components';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

export const NftList = ({ className, collectionId }: NftListComponentProps) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const getLimit = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });
  const { search, direction, page, onChangePagination, type } = useNftFilterContext();
  const { selectedAccount } = useAccounts();

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
        renderItem={(item: Token) => (
          <TokenLink
            alt={item.token_name}
            key={`${item.collection_id}-${item.token_id}`}
            image={item.image?.fullUrl || undefined}
            title={
              <>
                <Text appearance="block" size="l">
                  {item.token_name}
                </Text>
                <Text appearance="block" weight="light" size="s">
                  {item.collection_name} [id {item.collection_id}]
                </Text>
              </>
            }
            onTokenClick={() =>
              navigate(
                `/${currentChain?.network}/token/${item.collection_id}/${item.token_id}`,
              )
            }
          />
        )}
        visibleItems={getLimit}
        onPageChange={onChangePagination}
      />
    </PagePaper.Processing>
  );
};
