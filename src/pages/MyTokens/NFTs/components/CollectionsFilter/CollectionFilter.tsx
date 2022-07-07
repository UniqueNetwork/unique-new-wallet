import { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Accordion } from '@unique-nft/ui-kit';

import { Option } from '@app/types';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { getTokenIpfsUriByImagePath } from '@app/utils';

import { CollectionFilterItem } from './CollectionFilterItem';

export interface CollectionsFilterComponentProps {
  className?: string;
  isLoading: boolean;
  defaultCollections?: Option<number>[];
}

const CollectionsFilterComponent: VFC<CollectionsFilterComponentProps> = ({
  className,
  defaultCollections,
}) => {
  const { collectionsIds, changeCollectionsIds } = useNFTsContext();

  return (
    <div className={classNames('collections-filter', className)}>
      <Accordion expanded title="Collections">
        {defaultCollections?.map((c) => (
          <CollectionFilterItem
            key={c.id}
            id={c.id}
            icon={getTokenIpfsUriByImagePath(`${c.icon}`)}
            label={c.label}
            checked={collectionsIds.includes(c.id)}
            onChange={changeCollectionsIds}
          />
        ))}
      </Accordion>
    </div>
  );
};

export const CollectionsFilter = styled(CollectionsFilterComponent)`
  .loading {
    text-align: center;
  }
  &.collections-filter {
    padding-top: calc(var(--prop-gap)) 0;
  }
  &.collection-filter-item {
    margin-top: 16px;
  }
`;
