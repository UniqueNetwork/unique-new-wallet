import { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Accordion, RadioGroup } from '@unique-nft/ui-kit';

import { OptionChips } from '@app/types';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { TypeFilterNft } from '@app/api/graphQL/tokens';

interface TypeFilterComponentProps {
  type?: OptionChips<TypeFilterNft>[];
  className?: string;
}

const DEFAULT_TYPE: OptionChips<TypeFilterNft>[] = [];

const TypeFilterComponent: VFC<TypeFilterComponentProps> = ({
  className,
  type = DEFAULT_TYPE,
}) => {
  const { typeFilter, changeTypeFilter } = useNFTsContext();

  return (
    <div className={classNames('type-filter', className)}>
      <Accordion expanded title="Type">
        <RadioGroupWrapper>
          <RadioGroup
            options={type}
            value={typeFilter}
            onChange={({ value }) => changeTypeFilter(value as TypeFilterNft)}
          />
        </RadioGroupWrapper>
      </Accordion>
    </div>
  );
};

const RadioGroupWrapper = styled.div`
  margin-top: calc(var(--prop-gap) / 1.5);
`;

export const TypeFilter = styled(TypeFilterComponent)`
  margin-bottom: 32px;

  .type-filter {
    padding-top: calc(var(--prop-gap)) 0;
  }
`;
