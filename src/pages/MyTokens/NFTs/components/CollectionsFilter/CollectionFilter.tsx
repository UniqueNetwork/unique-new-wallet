import { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { Accordion } from '@app/components';
import { OptionChips } from '@app/types';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { getTokenIpfsUriByImagePath } from '@app/utils';

import { CollectionFilterItem } from './CollectionFilterItem';

export interface CollectionsFilterComponentProps {
  className?: string;
  collections?: OptionChips<number>[];
}

const CollectionsFilterComponent: VFC<CollectionsFilterComponentProps> = ({
  className,
  collections,
}) => {
  const { collectionsIds, changeCollectionsIds } = useNFTsContext();

  return (
    <div className={classNames('collections-filter', className)}>
      <Accordion isOpen title="Collections">
        {collections?.map((c) => (
          <CollectionFilterItem
            key={c.value}
            id={c.value}
            icon={getTokenIpfsUriByImagePath(c.icon)}
            label={c.label}
            checked={collectionsIds.includes(c.value)}
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
