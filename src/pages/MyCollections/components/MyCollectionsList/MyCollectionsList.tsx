import {
  CollectionLink,
  IPaginationProps,
  Loader,
  Pagination,
  Text,
} from '@unique-nft/ui-kit';
import classNames from 'classnames';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { TOrderBy } from '@app/api';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import AccountContext from '@app/account/AccountContext';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { NoItems } from '@app/components';
import { GridList } from '@app/pages/components/PageComponents';
import noCoverImage from '@app/static/icons/empty-image.svg';

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

  const { collections, collectionsCount, isCollectionsLoading } =
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

  return (
    <ListWrapper className={classNames('my-collections-list', className)}>
      {isCollectionsLoading ? (
        <Loader isFullPage={true} size="middle" />
      ) : collectionsCount > 0 ? (
        <ListContent>
          <GridList>
            {collections?.map((collection) => (
              <CollectionLink
                count={collection.tokens_count || 0}
                image={
                  collection.collection_cover
                    ? getTokenIpfsUriByImagePath(collection.collection_cover)
                    : noCoverImage
                }
                key={collection.collection_id}
                link={{
                  title: `${collection.name} [${collection.collection_id}]`,
                  href: `/${currentChain?.network}/my-collections/${collection.collection_id}/nft`,
                }}
              />
            ))}
          </GridList>
          <Footer>
            <Text size="m">
              {`${collectionsCount} ${collectionsCount === 1 ? 'item' : 'items'}`}
            </Text>
            <Pagination
              withIcons
              size={collectionsCount}
              current={page}
              onPageChange={onPageChange}
            />
          </Footer>
        </ListContent>
      ) : (
        <NoItems iconName="box" title="Nothing found" />
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
