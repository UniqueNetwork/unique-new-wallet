import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Chip, IconProps, IPaginationProps, Link, Text } from '@unique-nft/ui-kit';

import { Token } from '@app/api/graphQL/types';
import { TTokensCacheVar } from '@app/api';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { PagePaper, TokenLink } from '@app/components';
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
  const deviceSize = useDeviceSize();

  // TODO: move method to utils
  const getLimit = () => {
    switch (deviceSize) {
      case DeviceSize.sm:
      case DeviceSize.lg:
      case DeviceSize.xl:
        return 8;
      case DeviceSize.md:
        return 9;
      case DeviceSize.xxl:
      default:
        return 10;
    }
  };

  return (
    <PagePaper.Processing>
      <ListEntitiesCache entities={cacheTokens} />
      <List
        className={classNames('nft-list', className)}
        dataSource={tokens}
        fetchMore={fetchMore}
        isLoading={isLoading}
        panelSettings={{
          pagination: {
            current: paginationSettings.current,
            pageSizes: [getLimit()],
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
        visibleItems={getLimit()}
        onPageChange={onPageChange}
      />
    </PagePaper.Processing>
  );
};
