import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Chip, IconProps, IPaginationProps, Link, Text } from '@unique-nft/ui-kit';

import { Token } from '@app/api/graphQL/types';
import { TTokensCacheVar } from '@app/api';
import { useApi } from '@app/hooks';
import { defaultLimit } from '@app/pages/MyTokens/constants';
import { TokenLink } from '@app/components';
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

export const NFTsTemplateList = ({
  className,
  tokens = [],
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
  const [limit, setLimit] = useState(defaultLimit);

  const onFetchMore = () => {
    if (fetchMore) {
      const newLimit = limit + defaultLimit;

      fetchMore({
        variables: {
          limit: newLimit,
        },
      });
      setLimit(newLimit);
    }
  };

  return (
    <>
      <ListEntitiesCache entities={cacheTokens} />
      <List
        className={classNames('nft-list', className)}
        dataSource={tokens}
        isLoading={isLoading}
        loadMoreHandle={onFetchMore}
        panelSettings={{
          pagination: {
            current: paginationSettings.current,
            pageSizes: [defaultLimit],
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
            title={
              <>
                <Text appearance="block" size="l">
                  {item.token_name}
                </Text>
                <Text appearance="block" weight="light" size="s">
                  {item.collection_name} [id {item.collection_id}]
                </Text>
              </>
            }
            onTokenClick={() =>
              navigate(
                `/${currentChain?.network}/token/${item.collection_id}/${item.token_id}`,
              )
            }
          />
        )}
        showMore={fetchMore && paginationSettings.size >= limit}
        onPageChange={onPageChange}
      />
    </>
  );
};
