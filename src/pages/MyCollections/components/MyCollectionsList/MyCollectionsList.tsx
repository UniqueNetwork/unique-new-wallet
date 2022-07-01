import React, { useContext } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  CollectionLink,
  IPaginationProps,
  Loader,
  Pagination,
  Text,
} from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { TOrderBy } from '@app/api';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import AccountContext from '@app/account/AccountContext';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { LisFooter, PaddedBlock } from '@app/styles/styledVariables';
import { NotFoundCoins } from '@app/components';
import noCoverImage from '@app/static/icons/empty-image.svg';

interface MyCollectionsListComponentProps {
  className?: string;
  page: number;
  order?: TOrderBy;
  search?: string;
  onPageChange: IPaginationProps['onPageChange'];
}

const MyCollectionsListComponent = ({
  className,
  order,
  page,
  search,
  onPageChange,
}: MyCollectionsListComponentProps) => {
  const navigate = useNavigate();
  const { selectedAccount } = useContext(AccountContext);

  const { collections, collectionsCount, isCollectionsLoading } =
    useGraphQlCollectionsByAccount({
      accountAddress: selectedAccount?.address,
      options: {
        order,
        pagination: {
          page,
          limit: 10,
        },
        search,
      },
    });

  return (
    <div className={classNames('my-collections-list', className)}>
      {isCollectionsLoading ? (
        <Loader size="middle" />
      ) : collectionsCount > 0 ? (
        <>
          <List>
            {collections?.map((collection) => (
              /* TODO: div wrapper change onClick to href prop */
              <CollectionItem
                key={collection.collection_id}
                className={classNames({ '_no-cover': !collection.collection_cover })}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/my-collections/${collection.collection_id}/nft`);
                }}
              >
                <CollectionLink
                  count={collection.tokens_count || 0}
                  image={
                    collection.collection_cover
                      ? getTokenIpfsUriByImagePath(collection.collection_cover)
                      : noCoverImage
                  }
                  title={`${collection.name} [${collection.collection_id}]`}
                />
              </CollectionItem>
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
    </div>
  );
};

const Footer = styled.div`
  ${LisFooter}
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 30px 0;
`;

export const MyCollectionsList = styled(MyCollectionsListComponent)`
  ${PaddedBlock};
`;

const CollectionItem = styled.div`
  &._no-cover {
    & > .unique-collection-link {
      & > .unique-avatar {
        object-fit: none;
        background-color: var(--color-blue-grey-100);
      }
    }
  }
`;
