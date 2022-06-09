import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { NFTsTemplateList } from '@app/pages/components/Nfts/NFTsTemplateList';
import { useAccounts } from '@app/hooks';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

export const NftList = ({ className, collectionId }: NftListComponentProps) => {
  const { search, direction, page, onChangePagination } = useNftFilterContext();
  const { selectedAccount } = useAccounts();

  const { tokens, tokensCount, isLoadingTokens } = useGraphQlCollectionTokens({
    collectionId,
    collectionOwner: selectedAccount?.address,
    filter: {
      search,
    },
    options: {
      skip: !selectedAccount?.address,
      direction,
      pagination: {
        page,
        limit: 10,
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
