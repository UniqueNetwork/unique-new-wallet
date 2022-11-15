import classNames from 'classnames';
import { Chip, IconProps, IPaginationProps, Link } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { Token } from '@app/api/graphQL/types';
import { TTokensCacheVar } from '@app/api';
import { useApi, useItemsLimit } from '@app/hooks';
import { PagePaper } from '@app/components';
import List from '@app/components/List';
import { ListEntitiesCache } from '@app/pages/components/ListEntitysCache';
import { TokenNftLink } from '@app/pages/components/TokenNftLink';

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
  const getLimit = useItemsLimit({ sm: 8, md: 9, lg: 8, xl: 8 });
  const navigate = useNavigate();
  const { currentChain } = useApi();

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
        renderItem={(token: Token) => (
          <TokenNftLink
            key={`${token.collection_id}-${token.token_id}`}
            token={token}
            navigate={() => {
              navigate(
                `/${currentChain?.network}/token/${token.collection_id}/${token.token_id}`,
              );
            }}
          />
        )}
        visibleItems={getLimit}
        onPageChange={onPageChange}
      />
    </PagePaper.Processing>
  );
};
