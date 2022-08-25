import { Accordion, RadioGroup } from '@unique-nft/ui-kit';
import React, { useContext, useEffect, VFC } from 'react';
import styled from 'styled-components';

import AccountContext from '@app/account/AccountContext';
import {
  useGraphQlCollectionsByTokensOwner,
  useGraphQlOwnerTokens,
} from '@app/api/graphQL/tokens';
import { CollectionFilterItem } from '@app/pages/MyTokens/NFTs/components/CollectionsFilter/CollectionFilterItem';
import { getTokenIpfsUriByImagePath } from '@app/utils';

const Filters: VFC = () => {
  const { selectedAccount } = useContext(AccountContext);
  const { collections, collectionsLoading } = useGraphQlCollectionsByTokensOwner(
    selectedAccount?.address,
    !selectedAccount?.address,
  );
  return (
    <FilterWrapper>
      <Accordion title="Status" expanded={true}>
        <RadioGroup
          options={[
            {
              label: 'All',
              value: 'All',
            },
            {
              label: 'Create by me',
              value: 'Create by me',
            },
            {
              label: 'Purchased',
              value: 'Purchased',
            },
          ]}
          onChange={() => {}}
        />
      </Accordion>
      <Accordion title="Type" expanded={true}>
        <RadioGroup
          options={[
            {
              label: 'All',
              value: 'All',
            },
            {
              label: 'NFT',
              value: 'NFT',
            },
            {
              label: 'Fractional',
              value: 'Fractional',
            },
            {
              label: 'Bundle',
              value: 'Bundle',
            },
          ]}
          onChange={() => {}}
        />
      </Accordion>
      <Accordion expanded title="Collections">
        {!collectionsLoading &&
          collections?.map((c) => (
            <CollectionFilterItem
              key={c.collection_id}
              id={c.collection_id}
              icon={getTokenIpfsUriByImagePath(c.collection_cover || null)}
              label={c.collection_name}
              checked={false}
              onChange={() => {}}
            />
          ))}
      </Accordion>
    </FilterWrapper>
  );
};

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  .unique-accordion .unique-accordion-title {
    margin-bottom: 6px;
  }
  .collection-filter-item {
    margin: 0;
  }
`;

export default Filters;
