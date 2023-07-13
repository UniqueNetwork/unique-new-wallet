import { ReactNode } from 'react';
import classNames from 'classnames';

import './Loader.scss';
import { DimentionType, PlacementType } from '../types';

export interface LoaderProps {
  isFullPage?: boolean;
  label?: string | ReactNode | null;
  size?: DimentionType;
  placement?: PlacementType;
  state?: 'idle' | 'process' | 'done';
}

export const Loader = ({
  isFullPage = false,
  placement = 'right',
  size = 'small',
  label,
  state = 'process',
}: LoaderProps) => (
  <div
    className={classNames('unique-loader', {
      full: isFullPage,
    })}
    role="progressbar"
  >
    <div className={classNames('loader-content', placement)}>
      <div className={classNames('loader', size, state)} />
      {label && (
        <div data-testid="loader-label" className="loader-label">
          {label}
        </div>
      )}
    </div>
  </div>
);
