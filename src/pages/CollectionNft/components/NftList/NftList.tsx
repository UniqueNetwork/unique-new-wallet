import { useGraphQlTokens } from '@app/api/graphQL/tokens/useGraphQlTokens';
import { useNftFilterContext } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { NFTsTemplateList } from '@app/pages/components/Nfts/NFTsTemplateList';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

export const NftList = ({ className, collectionId }: NftListComponentProps) => {
  const { search, direction, page, onChangePagination } = useNftFilterContext();

  const { tokens, tokensCount, isLoadingTokens } = useGraphQlTokens({
    collectionId,
    collectionOwner: 'yGHXkYLYqxijLKKfd9Q2CB9shRVu8rPNBS53wvwGTutYg4zTg',
    filter: {
      search,
    },
    options: {
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
