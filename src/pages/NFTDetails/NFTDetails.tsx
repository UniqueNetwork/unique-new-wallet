import { VFC } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils';

import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { useTokenIsBundle } from '@app/api';
import { NftDetailsPage } from '@app/pages/NFTDetails/page/NftDetailsPage';
import { NftDetailsBundlePage } from '@app/pages/NFTDetails/page/NftDetailsBundlePage';
import { ErrorPage } from '@app/components';

interface NFTDetailsProps {
  className?: string;
}

const NFTDetailsComponent: VFC<NFTDetailsProps> = ({ className }) => {
  const { collectionId = '', tokenId = '', address = '' } = useParams();

  const { data, isLoading } = useTokenIsBundle({
    tokenId: parseInt(tokenId),
    collectionId: parseInt(collectionId),
  });

  if (!Address.is.validAddressInAnyForm(address)) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (data?.isBundle || Address.is.nestingAddress(address)) {
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
