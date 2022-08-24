import React, { useContext, useEffect, useMemo, useState, VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Avatar, Loader } from '@unique-nft/ui-kit';
import { useParams } from 'react-router-dom';
import { encodeAddress } from '@polkadot/util-crypto';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { PagePaper } from '@app/components';
import { usePageSettingContext } from '@app/context';
import AccountContext from '@app/account/AccountContext';
import { useGraphQlTokenById } from '@app/api/graphQL/tokens';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';

import { Attribute, Divider, NFTDetailsHeader, TokenInformation } from './components';

interface NFTDetailsProps {
  className?: string;
}

const FlexibleAvatar: VFC<{ url?: string }> = ({ url }) => {
  const size = useDeviceSize();
  const sides: Record<keyof typeof DeviceSize | string, string> = {
    xl: '536px',
    lg: '536px',
    md: '224px',
    sm: '100%',
    xs: '100%',
  };

  return <Avatar size={sides[DeviceSize[size]]} src={url} />;
};

const NFTDetailsComponent: VFC<NFTDetailsProps> = ({ className }) => {
  const { collectionId = '', tokenId = '' } = useParams();
  const { selectedAccount } = useContext(AccountContext);
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();
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
          <FlexibleAvatar url={token?.image?.fullUrl || undefined} />
          <div className="nft-page__info-container">
            <NFTDetailsHeader
              title={token?.token_name}
              collectionId={token?.collection_id}
              collectionName={token?.collection_name}
              ownerAddress={token?.owner}
              isCurrentAccountOwner={isCurrentAccountOwner}
              onShowModal={setCurrentModal}
            />
            <Divider />
            <TokenInformation attributes={attributes} />
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
  gap: 24px;

  .nft-page {
    &__loader {
      margin: auto;
    }

    &__avatar {
      margin-right: calc(var(--prop-gap) * 2);
    }

    &__info-container {
      flex-grow: 1;
      min-width: 0;
    }
  }

  @media (max-width: 767.98px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
