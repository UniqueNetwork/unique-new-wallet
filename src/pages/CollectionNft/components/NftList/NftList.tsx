import { useNavigate } from 'react-router-dom';
import { Text } from '@unique-nft/ui-kit';

import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { DeviceSize, useAccounts, useApi, useDeviceSize } from '@app/hooks';
import { useCheckExistTokensByAccount } from '@app/pages/hooks/useCheckExistTokensByAccount';
import { Token } from '@app/api/graphQL/types';
import List from '@app/components/List';
import { TokenLink } from '@app/components';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

export const NftList = ({ className, collectionId }: NftListComponentProps) => {
  const deviceSize = useDeviceSize();
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const { search, direction, page, onChangePagination, type } = useNftFilterContext();
  const { selectedAccount } = useAccounts();

  // TODO: move method to utils
  const getItems = () => {
    switch (deviceSize) {
      case DeviceSize.sm:
      case DeviceSize.lg:
        return 8;
      case DeviceSize.md:
        return 9;
      default:
        return 10;
    }
  };

  const { tokens, tokensCount, isLoadingTokens, isPagination } =
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
          limit: getItems(),
        },
      },
    });

  const { cacheTokens } = useCheckExistTokensByAccount({
    tokens,
    collectionId: parseInt(collectionId),
  });

  // TODO: WAS NFTsTemplateList prop cacheTokens={cacheTokens}

  return (
    <>
      <ListEntitiesCache entities={cacheTokens} />
      <List
        className={className}
        dataSource={tokens}
        isLoading={isLoadingTokens}
        panelSettings={{
          pagination: {
            current: page,
            pageSizes: [getItems()],
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
        onPageChange={onChangePagination}
      />
    </>
  );
};
