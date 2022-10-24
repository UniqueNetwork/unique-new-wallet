import { VFC } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@unique-nft/ui-kit';

import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { useTokenIsBundle } from '@app/api';
import { NftDetailsPage } from '@app/pages/NFTDetails/page/NftDetailsPage';
import { NftDetailsBundlePage } from '@app/pages/NFTDetails/page/NftDetailsBundlePage';

interface NFTDetailsProps {
  className?: string;
}

const NFTDetailsComponent: VFC<NFTDetailsProps> = ({ className }) => {
  const { collectionId = '', tokenId = '' } = useParams();

  const { data, isLoading } = useTokenIsBundle({
    tokenId: parseInt(tokenId),
    collectionId: parseInt(collectionId),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (data?.isBundle) {
    return <NftDetailsBundlePage />;
  }

  if (data && !data.isBundle) {
    return <NftDetailsPage />;
  }

  return null;
};

export const NFTDetails = withPageTitle({
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(NFTDetailsComponent);
