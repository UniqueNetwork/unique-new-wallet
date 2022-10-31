import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Chip, IconProps, IPaginationProps, Link, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { Token, TokenTypeEnum } from '@app/api/graphQL/types';
import { TTokensCacheVar } from '@app/api';
import { useApi, useItemsLimit } from '@app/hooks';
import { Achievement, PagePaper, TokenLink } from '@app/components';
import List from '@app/components/List';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';

type PaginationSettingsProps = Pick<
  IPaginationProps,
  'current' | 'pageSizes' | 'size'
> & {
  show?: boolean;
};

type NFTsListComponentProps = Pick<IPaginationProps, 'onPageChange'> & {
  className?: string;
  tokens?: Token[];
  isLoading: boolean;
  paginationSettings: PaginationSettingsProps;
  chips?: {
    label: string;
    iconLeft?: IconProps;
    onClose?(): void;
  }[];
  fetchMore?(variables?: any): void;
  onPageChange: IPaginationProps['onPageChange'];
  onChipsReset?(): void;
  cacheTokens: TTokensCacheVar;
};

const DEFAULT_TOKENS: Token[] = [];

export const NFTsTemplateList = ({
  className,
  tokens = DEFAULT_TOKENS,
  isLoading,
  chips,
  paginationSettings,
  fetchMore,
  onPageChange,
  onChipsReset,
  cacheTokens,
}: NFTsListComponentProps) => {
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const getLimit = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });

  const renderBadge = (type: TokenTypeEnum) => {
    if (type === 'NESTED') {
      return (
        <Achievement
          achievement="Bundle"
          tooltipDescription={
            <>
              A&nbsp;group of&nbsp;tokens nested in&nbsp;an&nbsp;NFT and having
              a&nbsp;nested, ordered, tree-like structure
            </>
          }
        />
      );
    }
    return null;
  };

  return (
    <PagePaper.Processing>
      <ListEntitiesCache entities={cacheTokens} />
      <List
        className={classNames('nft-list', className)}
        dataSource={tokens}
        fetchMore={fetchMore}
        isLoading={isLoading}
        itemCols={{ sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
        panelSettings={{
          pagination: {
            current: paginationSettings.current,
            pageSizes: [getLimit],
            show: paginationSettings.show,
            size: paginationSettings.size,
            viewMode: 'bottom',
          },
          extraText: (
            <>
              {chips?.map((item, index) => (
                <Chip key={index} {...item} />
              ))}
              {!!chips?.length && (
                <Link title="Clear all" role="danger" onClick={onChipsReset} />
              )}
            </>
          ),
          viewMode: 'both',
        }}
        renderItem={(item: Token) => (
          <TokenLink
            alt={item.token_name}
            key={`${item.collection_id}-${item.token_id}`}
            image={item.image?.fullUrl || undefined}
            badge={renderBadge(item.type)}
            title={
              <>
                <Text appearance="block" size="l">
                  {item.token_name}
                </Text>
                <Text appearance="block" weight="light" size="s">
                  {item.collection_name} [id {item.collection_id}]
                </Text>
                {item.type === 'NESTED' && (
                  <NestedWrapper>
                    <Text appearance="block" weight="light" size="s" color="grey-500">
                      Nested items: <span className="count">{item.children_count}</span>
                    </Text>
                  </NestedWrapper>
                )}
              </>
            }
            onTokenClick={() =>
              navigate(
                `/${currentChain?.network}/token/${item.collection_id}/${item.token_id}`,
              )
            }
          />
        )}
        visibleItems={getLimit}
        onPageChange={onPageChange}
      />
    </PagePaper.Processing>
  );
};

const NestedWrapper = styled.div`
  margin-top: calc(var(--prop-gap) / 2);

  .count {
    color: var(--color-additional-dark);
  }
`;
