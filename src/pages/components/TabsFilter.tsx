import { ReactNode } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import { DeviceSize, useDeviceSize } from '@app/hooks';

interface TabsFilterProps {
  buttons?: ReactNode;
  className?: string;
  controls?: ReactNode;
}

const TabsFilterWrapper = styled.div`
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  gap: calc(var(--prop-gap) * 2);

  .filter {
    &__controls {
      display: flex;
      flex: 1 1 auto;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .unique-input-text,
  .unique-select,
  .unique-button {
    width: 100%;
  }

  .unique-input-text {
    max-width: 370px;
  }

  .unique-select {
    margin-left: var(--prop-gap);

    @media screen and (min-width: 1024px) {
      flex: 1 1 50%;
      max-width: 180px;
    }

    .select-value {
      grid-column-gap: 7px;
    }
  }

  .unique-radio-group-wrapper {
    margin-right: calc(var(--prop-gap) * 2);

    .unique-radio-wrapper {
      margin-bottom: 0;
    }
  }
`;

export const TabsFilter = ({ buttons, className, controls }: TabsFilterProps) => {
  const deviceSize = useDeviceSize();

  return (
    <TabsFilterWrapper className={classNames('filter', className)}>
      {deviceSize > DeviceSize.md && <div className="filter__controls">{controls}</div>}
      <div className="filter__buttons">{buttons}</div>
    </TabsFilterWrapper>
  );
};
