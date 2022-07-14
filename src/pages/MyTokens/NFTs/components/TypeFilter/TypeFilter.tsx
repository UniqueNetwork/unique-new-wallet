import { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Accordion } from '@unique-nft/ui-kit';

import { Option } from '@app/types';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { TypeFilter as TFilter } from '@app/api/graphQL/tokens';

import { TypeFilterItem } from './TypeFilterItem';

export interface TypeFilterComponentProps {
  defaultTypes?: Option<TFilter>[];
  defaultCollections?: Option<number>[];
  className?: string;
}

const TypeFilterComponent: VFC<TypeFilterComponentProps> = ({
  className,
  defaultTypes,
}) => {
  const { typesFilters, changeTypesFilters } = useNFTsContext();

  return (
    <div className={classNames('collections-filter', className)}>
      <Accordion expanded title="Types">
        {defaultTypes?.map((t) => (
          <TypeFilterItem
            key={t.id}
            id={t.id}
            label={t.label}
            checked={typesFilters.includes(t.id)}
            onChange={changeTypesFilters}
          />
        ))}
      </Accordion>
    </div>
  );
};

export const TypeFilter = styled(TypeFilterComponent)`
  margin-bottom: 32px;

  .collections-filter {
    padding-top: calc(var(--prop-gap)) 0;
  }

  .type-filter-item {
    margin-top: 16px;
  }
`;
