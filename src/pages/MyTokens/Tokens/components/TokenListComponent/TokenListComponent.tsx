import classNames from 'classnames';
import { ReactNode } from 'react';

import { Token } from '@app/api/graphQL/types';
import { TTokensCacheVar } from '@app/api';
import { DeviceSize, useDeviceSize, useItemsLimit } from '@app/hooks';
import {
  PagePaper,
  Chip,
  IconProps,
  IPaginationProps,
  Link,
  List,
} from '@app/components';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';
import { TokenLink } from '@app/pages/components/TokenLink';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';

type PaginationSettingsProps = Pick<
  IPaginationProps,
  'current' | 'pageSizes' | 'size' | 'perPage'
> & {
  show?: boolean;
};

type TokensListComponentProps = Pick<IPaginationProps, 'onPageChange'> & {
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
  onPageSizeChange: IPaginationProps['onPageSizeChange'];
  onChipsReset?(): void;
  cacheTokens: TTokensCacheVar;
  noItemsIconName?: string;
  noItemsTitle?: ReactNode;
};

const DEFAULT_TOKENS: Token[] = [];

export const DEFAULT_PAGE_SIZE_OPTIONS: number[] = [24, 36, 48, 60];

export const TokenListComponent = ({
  className,
  tokens = DEFAULT_TOKENS,
  isLoading,
  chips,
  paginationSettings,
  fetchMore,
  onPageChange,
  onPageSizeChange,
  onChipsReset,
  cacheTokens,
  noItemsIconName = 'not-found',
  noItemsTitle = 'Nothing found',
}: TokensListComponentProps) => {
  const { limit } = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });
  const getTokenPath = useGetTokenPath();
  const deviceSize = useDeviceSize();

  const hidePurePagination = deviceSize < DeviceSize.lg;

  return (
    <PagePaper.Processing>
      <ListEntitiesCache entities={cacheTokens} />
      <List
        className={classNames('nft-list', className)}
        dataSource={tokens}
        fetchMore={hidePurePagination ? fetchMore : undefined}
        isLoading={isLoading}
        itemCols={{ sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
        noItemsIconName={noItemsIconName}
        noItemsTitle={noItemsTitle}
        panelSettings={{
          pagination: {
            current: paginationSettings.current,
            perPage: paginationSettings.perPage,
            pageSizes: hidePurePagination ? [limit] : DEFAULT_PAGE_SIZE_OPTIONS,
            show: paginationSettings.show,
            size: paginationSettings.size,
            perPageSelector: !hidePurePagination,
            viewMode: 'both',
            itemTitle: 'result',
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
        renderItem={(token: Token) => (
          <TokenLink
            key={`${token.collection_id}-${token.token_id}`}
            token={token}
            link={getTokenPath(
              token.tokens_owner || '',
              token.collection_id,
              token.token_id,
            )}
          />
        )}
        visibleItems={limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </PagePaper.Processing>
  );
};
