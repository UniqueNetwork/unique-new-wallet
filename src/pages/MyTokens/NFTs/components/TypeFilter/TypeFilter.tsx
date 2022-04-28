import { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Accordion, RadioGroup } from '@unique-nft/ui-kit';

export interface TypeFilterComponentProps {
  className?: string;
}

const options = [
  {
    value: 'All collections',
  },
  {
    value: 'Created by me',
  },
  {
    value: 'Purchased',
  },
];

const TypeFilterComponent: VFC<TypeFilterComponentProps> = ({ className }) => {
  const onChange = () => {
    console.log('Type Filter value');
  };

  return (
    <div className={classNames('type-filter', className)}>
      <Accordion expanded title="Type Filter">
        <RadioGroup align="vertical" options={options} onChange={onChange} />
      </Accordion>
    </div>
  );
};

export const TypeFilter = styled(TypeFilterComponent)`
  &.type-filter {
    .unique-accordion-content {
      padding: calc(var(--gap)) 0;
    }
  }
`;
