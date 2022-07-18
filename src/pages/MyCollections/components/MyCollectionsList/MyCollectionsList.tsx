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

import AccountContext from '@app/account/AccountContext';
import { TOrderBy } from '@app/api';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { NotFoundCoins } from '@app/components';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import noCoverImage from '@app/static/icons/empty-image.svg';
import { LisFooter, PaddedBlock } from '@app/styles/styledVariables';
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
        <Loader size="middle" />
      ) : collectionsCount > 0 ? (
        <>
          <List>
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
          </List>
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
        </>
      ) : (
        <NotFoundCoins />
      )}
    </ListWrapper>
  );
};

const Footer = styled.div`
  ${LisFooter}
`;

const ListWrapper = styled.div`
  &.my-collections-list {
    padding: var(--prop-gap) 0 calc(var(--prop-gap) * 2);

    @media screen and (min-width: 1024px) {
      ${PaddedBlock};
    }
  }
`;

const List = styled.div`
  display: grid;
  gap: var(--prop-gap);

  @media screen and (min-width: 520px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;
