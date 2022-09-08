import { IPaginationProps, Loader, Pagination, Text } from '@unique-nft/ui-kit';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AccountContext from '@app/account/AccountContext';
import { TOrderBy } from '@app/api';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { Collection } from '@app/api/graphQL/types';
import { NoItems, TokenLink } from '@app/components';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { GridListCommon } from '@app/pages/components/PageComponents';
import { MY_COLLECTIONS_ROUTE, ROUTE } from '@app/routes';
import { getTokenIpfsUriByImagePath } from '@app/utils';

interface MyCollectionsListProps {
  className?: string;
  page: number;
  order?: TOrderBy;
  search?: string;
  onPageChange: IPaginationProps['onPageChange'];
}

export const MyCollectionsList = ({
  className,
  order,
  page,
  search,
  onPageChange,
}: MyCollectionsListProps) => {
  const { currentChain } = useApi();
  const deviceSize = useDeviceSize();
  const { selectedAccount } = useContext(AccountContext);
  const navigate = useNavigate();

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

  const { collections, collectionsCount, isCollectionsLoading, isPagination } =
    useGraphQlCollectionsByAccount({
      accountAddress: selectedAccount?.address,
      options: {
        order,
        pagination: {
          page,
          limit: getItems(),
        },
        search,
      },
    });

  const onClickNavigate = (id: Collection['collection_id']) =>
    navigate(
      `/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}/${id}/${MY_COLLECTIONS_ROUTE.NFT}`,
    );

  return (
    <ListWrapper className={classNames('my-collections-list', className)}>
      {isCollectionsLoading ? (
        <Loader isFullPage={true} size="middle" />
      ) : collectionsCount > 0 ? (
        <ListContent>
          <Result size="m">
            {`${collectionsCount} ${collectionsCount === 1 ? 'result' : 'results'}`}
          </Result>
          <GridList>
            {collections?.map((collection) => (
              <TokenLink
                image={getTokenIpfsUriByImagePath(collection.collection_cover)}
                title={`${collection.name} [${collection.collection_id}]`}
                meta={
                  <>
                    <Text color="grey-500" size="s">
                      Items:{' '}
                    </Text>
                    <Text size="s">{collection.tokens_count || 0}</Text>
                  </>
                }
                key={collection.collection_id}
                onTokenClick={() => onClickNavigate(collection.collection_id)}
                onMetaClick={() => onClickNavigate(collection.collection_id)}
              />
            ))}
          </GridList>
          <Footer>
            <Text size="m">
              {`${collectionsCount} ${collectionsCount === 1 ? 'result' : 'results'}`}
            </Text>
            {isPagination && (
              <Pagination
                withIcons={true}
                size={collectionsCount}
                current={page}
                onPageChange={onPageChange}
              />
            )}
          </Footer>
        </ListContent>
      ) : (
        <NoItems iconName="box" />
      )}
    </ListWrapper>
  );
};

const Footer = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  padding-top: calc(var(--prop-gap) * 2);
`;

const ListWrapper = styled.div`
  &.my-collections-list {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    padding: var(--prop-gap) 0 calc(var(--prop-gap) * 2);

    @media screen and (min-width: 1024px) {
      padding: calc(var(--prop-gap) * 2);
    }
  }
`;

const ListContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const Result = styled(Text)`
  margin-bottom: var(--prop-gap);
`;

const GridList = styled(GridListCommon)`
  @media screen and (min-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;
