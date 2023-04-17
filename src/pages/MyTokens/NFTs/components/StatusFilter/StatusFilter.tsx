import { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { Accordion, RadioGroup } from '@app/components';
import { OptionChips } from '@app/types';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { StatusFilterNft } from '@app/api/graphQL/tokens';

interface StatusFilterComponentProps {
  status?: OptionChips<StatusFilterNft>[];
  className?: string;
}

const DEFAULT_STATUS: OptionChips<StatusFilterNft>[] = [];

const StatusFilterComponent: VFC<StatusFilterComponentProps> = ({
  className,
  status = DEFAULT_STATUS,
}) => {
  const { statusFilter, changeStatusFilter } = useNFTsContext();

  return (
    <div className={classNames('status-filter', className)}>
      <Accordion isOpen title="Status">
        <RadioGroupWrapper>
          <RadioGroup
            options={status}
            value={statusFilter}
            onChange={({ value }) => changeStatusFilter(value as StatusFilterNft)}
          />
        </RadioGroupWrapper>
      </Accordion>
    </div>
  );
};

const RadioGroupWrapper = styled.div`
  margin-top: calc(var(--prop-gap) / 1.5);
`;

export const StatusFilter = styled(StatusFilterComponent)`
  margin-bottom: 32px;

  .status-filter {
    padding-top: calc(var(--prop-gap)) 0;
  }
`;
