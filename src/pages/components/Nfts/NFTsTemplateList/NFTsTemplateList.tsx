import { FetchMoreOptions } from '@apollo/client';
import {
  Button,
  Chip,
  IconProps,
  IPaginationProps,
  Link,
  Loader,
  Pagination,
  Text,
} from '@unique-nft/ui-kit';
import classNames from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Token } from '@app/api/graphQL/types';
import { NoItems, TokenLink } from '@app/components';
import { useApi } from '@app/hooks';
import { GridListCommon } from '@app/pages/components/PageComponents';
import { defaultLimit } from '@app/pages/MyTokens/constants';
import { ROUTE } from '@app/routes';

interface NFTsListComponentProps {
  className?: string;
  tokens?: Token[];
  tokensCount?: number;
  isLoading: boolean;
  page: number;
  chips?: {
    label: string;
    iconLeft?: IconProps;
    onClose?(): void;
  }[];
  fetchMore?(variables?: any): void | undefined;
  onPageChange: IPaginationProps['onPageChange'];
  onChipsReset?(): void;
}

const renderItemsCount = (count = 0) => (
  <Text weight="light">
    {count} {count === 1 ? 'result' : 'results'}
  </Text>
);

const NFTsListComponent = ({
  className,
  tokens = [],
  tokensCount,
  page,
  isLoading,
  chips,
  fetchMore,
  onPageChange,
  onChipsReset,
}: NFTsListComponentProps) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const [moreCount, setMoreCount] = useState(10);

  return (
    <div className={classNames('nft-list', className)}>
      {isLoading && <Loader isFullPage={true} size="middle" />}
      {!isNaN(Number(tokensCount)) && (
        <div className="nft-list__header">
          {renderItemsCount(tokensCount)}
          {chips?.map((item, index) => (
            <Chip key={index} {...item} />
          ))}
          {!!chips?.length && (
            <Link title="Clear all" role="danger" onClick={onChipsReset} />
          )}
        </div>
      )}

      <div
        className={classNames('nft-list__items', {
          _empty: !tokensCount,
        })}
      >
        {tokensCount === 0 ? (
          <NoItems iconName="not-found" />
        ) : (
          <GridList>
            {tokens.map(
              ({ token_id, token_name, collection_name, collection_id, image }) => (
                <TokenLink
                  alt={token_name}
                  key={`${collection_id}-${token_id}`}
                  link={`${collection_name} [id ${collection_id}]`}
                  image={image?.fullUrl || undefined}
                  title={
                    <>
                      <Text appearance="block" size="l">
                        {token_name}
                      </Text>
                      <Text appearance="block" weight="light" size="s">
                        {collection_name} [id {collection_id}]
                      </Text>
                    </>
                  }
                  onTokenClick={() =>
                    navigate(
                      `/${currentChain?.network}/token/${collection_id}/${token_id}`,
                    )
                  }
                />
              ),
            )}
          </GridList>
        )}
      </div>

      {!!tokensCount && (
        <PaginatorWrapper className="nft-list__footer">
          <DesktopPagination>
            {renderItemsCount(tokensCount)}
            <Pagination
              withIcons={true}
              current={page}
              size={tokensCount}
              onPageChange={onPageChange}
            />
          </DesktopPagination>
          <MobilePagination>
            {tokensCount >= defaultLimit + moreCount && (
              <Button
                wide
                title="Load more"
                iconRight={{
                  color: 'var(--color-primary-500)',
                  name: 'arrow-down',
                  size: 16,
                }}
                onClick={() => {
                  if (fetchMore) {
                    fetchMore({
                      variables: { page, limit: defaultLimit + moreCount },
                    });
                    setMoreCount(moreCount + 10);
                  }
                }}
              />
            )}
          </MobilePagination>
        </PaginatorWrapper>
      )}
    </div>
  );
};

export const DesktopPagination = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 1279px) {
    margin-bottom: 40px;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobilePagination = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    width: 100%;
  }
`;
export const PaginatorWrapper = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;
export const NFTsTemplateList = styled(NFTsListComponent)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 calc(100% - var(--prop-gap) * 4);
  padding: calc(var(--prop-gap) * 2);
  @media (max-width: 1024px) {
    padding: calc(var(--prop-gap) * 2) 0;
  }

  .unique-text {
    word-break: break-all;
    overflow: initial;
  }

  .nft-list {
    &__header {
      min-height: 32px;
      display: flex;
      flex: 0 0 auto;
      flex-flow: wrap;
      align-items: center;
      gap: 10px;
      padding-bottom: calc(var(--prop-gap) * 1.5);
    }

    &__footer {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: space-between;
      padding-top: calc(var(--prop-gap) * 2);
    }

    &__items {
      display: flex;
      flex: 1 1 auto;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: calc(var(--prop-gap) * 2);

      &._empty {
        align-items: center;
      }
    }
  }
`;

const GridList = styled(GridListCommon)`
  @media screen and (min-width: 820px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1500px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;
