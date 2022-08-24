import React, { useContext, useMemo, useState, VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Avatar, Loader } from '@unique-nft/ui-kit';
import { useParams } from 'react-router-dom';
import { encodeAddress } from '@polkadot/util-crypto';

import AccountContext from '@app/account/AccountContext';
import { useGraphQlTokenById } from '@app/api/graphQL/tokens';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { PagePaper } from '@app/components';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';
import { withPageTitle } from '@app/HOCs/withPageTitle';

import {
  Attribute,
  CollectionInformation,
  Divider,
  NFTDetailsHeader,
  TokenInformation,
} from './components';

interface NFTDetailsProps {
  className?: string;
}

const NFTDetailsComponent: VFC<NFTDetailsProps> = ({ className }) => {
  const { collectionId = '', tokenId = '' } = useParams();
  const { selectedAccount } = useContext(AccountContext);
  const [currentModal, setCurrentModal] = useState<TNFTModalType>('none');

  const { token, loading, refetch } = useGraphQlTokenById(
    parseInt(tokenId),
    parseInt(collectionId),
  );

  const attributes = useMemo<Attribute[]>(() => {
    if (!token) {
      return [];
    }

    const attrsValues = Object.values(token?.attributes);

    return attrsValues.map(({ name, value }) => ({
      title: name._,
      tags: Array.isArray(value) ? value.map((val) => val._) : [value._],
    }));
  }, [token?.attributes]);

  const isCurrentAccountOwner =
    selectedAccount?.address &&
    token?.owner &&
    encodeAddress(selectedAccount?.address) === encodeAddress(token?.owner);

  const onModalClose = () => setCurrentModal('none');

  const onComplete = () => {
    refetch();
    setCurrentModal('none');
  };

  return (
    <PagePaper className={classNames(className, 'nft-page')}>
      {loading ? (
        <div className="nft-page__loader">
          <Loader size="middle" />
        </div>
      ) : (
        <>
          <div className="nft-page__avatar">
            <Avatar size={536} src={token?.image?.fullUrl || undefined} />
          </div>
          <div className="nft-page__info-container">
            <NFTDetailsHeader
              title={token?.token_name}
              ownerAddress={token?.owner}
              isCurrentAccountOwner={isCurrentAccountOwner}
              onShowModal={setCurrentModal}
            />
            <Divider />
            <TokenInformation attributes={attributes} />
            <Divider />
            <CollectionInformation
              title={token?.collection_name}
              avatar={token?.collection_cover}
              description={token?.collection_description}
            />
          </div>
        </>
      )}
      <NFTModals
        modalType={currentModal}
        token={token}
        onComplete={onComplete}
        onClose={onModalClose}
      />
    </PagePaper>
  );
};

const NFTDetailsStyled = styled(NFTDetailsComponent)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 500px;

  .nft-page {
    &__loader {
      margin: auto;
    }

    &__avatar {
      margin-right: calc(var(--prop-gap) * 2);
    }

    &__info-container {
      flex-grow: 1;
    }
  }
`;

export const NFTDetails = withPageTitle({
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(NFTDetailsStyled);
