import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { DeviceSize, useAccounts, useDeviceSize } from '@app/hooks';
import { NFTsTemplateList } from '@app/pages/components/Nfts/NFTsTemplateList';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

export const NftList = ({ className, collectionId }: NftListComponentProps) => {
  const deviceSize = useDeviceSize();
  const { search, direction, page, onChangePagination, type } = useNftFilterContext();
  const { selectedAccount } = useAccounts();

  // TODO: move method to utils
  const getItems = () => {
    switch (deviceSize) {
      case DeviceSize.sm:
        return 8;
      case DeviceSize.md:
        return 9;
      case DeviceSize.lg:
        return 8;
      default:
        return 10;
    }
  };

  const { tokens, tokensCount, isLoadingTokens } = useGraphQlCollectionTokens({
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

  return (
    <NFTsTemplateList
      tokensCount={tokensCount}
      page={page}
      isLoading={isLoadingTokens}
      tokens={tokens}
      className={className}
      onPageChange={onChangePagination}
    />
  );
};
