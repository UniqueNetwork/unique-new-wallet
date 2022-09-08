import { useContext, useMemo, useState, VFC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { encodeAddress } from '@polkadot/util-crypto';
import { Avatar, Loader } from '@unique-nft/ui-kit';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import AccountContext from '@app/account/AccountContext';
import { useGraphQlTokenById } from '@app/api/graphQL/tokens';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { ErrorPage, PagePaper } from '@app/components';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';

import { Attribute, Divider, NFTDetailsHeader, TokenInformation } from './components';

interface NFTDetailsProps {
  className?: string;
}

const NFTDetailsComponent: VFC<NFTDetailsProps> = ({ className }) => {
  const deviseSize = useDeviceSize();
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
    <PagePaper
      className={className}
      flexLayout="row"
      noPadding={deviseSize <= DeviceSize.md}
    >
      {!loading && !token ? (
        <ErrorPage />
      ) : (
        <div
          className={classNames('nft-page', {
            _empty: !token && !loading,
          })}
        >
          {loading ? (
            <div className="nft-page__loader">
              <Loader size="middle" />
            </div>
          ) : (
            <>
              <div className="nft-page__avatar">
                <Avatar fit="contain" src={token?.image?.fullUrl || undefined} />
              </div>
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
        </div>
      )}
    </PagePaper>
  );
};

const NFTDetailsStyled = styled(NFTDetailsComponent)`
  .nft-page {
    --page-gap: calc(var(--prop-gap) * 1.5);

    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    gap: var(--page-gap);
    max-width: 100%;

    @media screen and (min-width: 768px) {
      flex-direction: row;
      flex-wrap: nowrap;
    }

    &:not(._empty) {
      align-items: flex-start;
    }

    &__loader {
      margin: auto;
    }

    &__avatar {
      overflow: hidden;
      border-radius: calc(var(--prop-border-radius) * 2);
      position: relative;
      flex: 0 0 auto;
      width: 100%;
      background-color: var(--color-blue-grey-100);
      transform: translateZ(0);

      @media screen and (min-width: 768px) {
        flex: 0 0 30%;
        max-width: 536px;
      }

      @media screen and (min-width: 1024px) {
        flex: 0 0 34%;
      }

      @media screen and (min-width: 1280px) {
        flex: 3 0 0;
      }

      &::before {
        display: block;
        padding-bottom: 100%;
        content: '';
      }

      & > img {
        border-radius: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        transform: translate3d(-50%, -50%, 0);
      }
    }

    &__info-container {
      flex: 0 0 100%;
      max-width: 100%;

      @media screen and (min-width: 768px) {
        flex: 0 0 calc(70% - var(--page-gap));
        max-width: calc(70% - var(--page-gap));
      }

      @media screen and (min-width: 1024px) {
        max-width: calc(66% - var(--page-gap));
      }

      @media screen and (min-width: 1280px) {
        flex: 4.5 0 0;
        max-width: none;
      }
    }
  }
`;

export const NFTDetails = withPageTitle({
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(NFTDetailsStyled);
