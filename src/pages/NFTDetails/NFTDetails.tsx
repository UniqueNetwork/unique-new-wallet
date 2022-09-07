import { useContext, useMemo, useState, VFC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { encodeAddress } from '@polkadot/util-crypto';
import { Avatar, Loader } from '@unique-nft/ui-kit';

import { DeviceSize, useDeviceSize } from '@app/hooks';
import { ErrorPage, PagePaper } from '@app/components';
import { usePageSettingContext } from '@app/context';
import AccountContext from '@app/account/AccountContext';
import { useGraphQlTokenById } from '@app/api/graphQL/tokens';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { NFTModals, TNFTModalType } from '@app/pages/NFTDetails/Modals';
import { withPageTitle } from '@app/HOCs/withPageTitle';

import { Attribute, Divider, NFTDetailsHeader, TokenInformation } from './components';

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
    <PagePaper
      className={classNames(className, 'nft-page', {
        _empty: !token && !loading,
      })}
    >
      {!loading && !token ? (
        <ErrorPage />
      ) : (
        <>
          {loading ? (
            <div className="nft-page__loader">
              <Loader size="middle" />
            </div>
          ) : (
            <>
              <Avatar
                fit="contain"
                className="nft-page__avatar"
                src={token?.image?.fullUrl || undefined}
              />
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
        </>
      )}
    </PagePaper>
  );
};

const NFTDetailsStyled = styled(NFTDetailsComponent)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: calc(var(--prop-gap) * 1.5);

  @media (max-width: 1023.98px) {
    padding: 0;
  }

  @media (max-width: 767.98px) {
    flex-direction: column;
    align-items: stretch;
  }

  &:not(._empty) {
    align-items: flex-start;
  }

  .nft-page {
    &__loader {
      margin: auto;
    }

    &__avatar-container {
      position: relative;
      max-width: 536px;
      height: 0;
    }

    &__avatar {
      flex: 4 0 0%;
      width: 100%;
      height: 100%;
      aspect-ratio: 1 / 1;

      @media (min-width: 768px) {
        max-width: 536px;
        margin-right: calc(var(--prop-gap) * 1.5);
      }
    }

    &__info-container {
      flex: 5 0 0%;

      /* @media (min-width: 768px) {
        min-width: 472px;
      } */
    }
  }
`;

export const NFTDetails = withPageTitle({
  backLink: `${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
})(NFTDetailsStyled);
