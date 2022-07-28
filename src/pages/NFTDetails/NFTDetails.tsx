import React, { useContext, useEffect, useState, VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Avatar, Loader } from '@unique-nft/ui-kit';
import { useParams } from 'react-router-dom';
import { encodeAddress } from '@polkadot/util-crypto';

import { usePageSettingContext } from '@app/context';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import AccountContext from '@app/account/AccountContext';
import { useGraphQlTokenById } from '@app/api/graphQL/tokens';
import { PagePaper } from '@app/components';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';

import {
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
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();
  const [currentModal, setCurrentModal] = useState<TNFTModalType>('none');

  const { token, loading, refetch } = useGraphQlTokenById(
    parseInt(tokenId),
    parseInt(collectionId),
  );

  const avatar = getTokenIpfsUriByImagePath(token?.image_path ?? '');
  const isCurrentAccountOwner =
    selectedAccount?.address &&
    token?.owner &&
    encodeAddress(selectedAccount?.address) === encodeAddress(token?.owner);

  const onModalClose = () => setCurrentModal('none');

  const onComplete = () => {
    refetch();
    setCurrentModal('none');
  };

  useEffect(() => {
    setPageBreadcrumbs({
      options: [
        {
          title: '🡠 back',
          link: '/my-tokens/nft',
        },
      ],
    });
    setPageHeading('');
  }, []);

  return (
    <PagePaper className={classNames(className, 'nft-page')}>
      {loading ? (
        <div className="nft-page__loader">
          <Loader size="middle" />
        </div>
      ) : (
        <>
          <div className="nft-page__avatar">
            <Avatar size={536} src={avatar} />
          </div>
          <div className="nft-page__info-container">
            <NFTDetailsHeader
              title={token?.token_name}
              ownerAddress={token?.owner}
              isCurrentAccountOwner={isCurrentAccountOwner}
              onShowModal={setCurrentModal}
            />
            <Divider />
            <TokenInformation attributes={token?.data} />
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

export const NFTDetails = styled(NFTDetailsComponent)`
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
