import { ReactNode } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--prop-gap) calc(var(--prop-gap) * 2);
  padding: calc(var(--prop-gap) * 2) 0;

  @media screen and (min-width: 1024px) {
    padding-left: calc(var(--prop-gap) * 2);
    padding-right: calc(var(--prop-gap) * 2);
  }

  &.__stackedWith {
    &_both {
      padding-top: 0;
      padding-bottom: 0;
    }

    &_bottom {
      padding-top: 0;
    }

    &_top {
      padding-bottom: 0;
    }
  }
`;

export interface PanelProps {
  children?: ReactNode;
  className?: string;
  stacked?: 'both' | 'bottom' | 'top' | undefined;
  role?: string;
}

const Panel = ({ children, className, role, stacked }: PanelProps) => {
  return (
    <Wrapper
      className={classNames(className, { [`__stackedWith_${stacked}`]: stacked })}
      role={role}
    >
      {children}
    </Wrapper>
  );
};

export default Panel;
