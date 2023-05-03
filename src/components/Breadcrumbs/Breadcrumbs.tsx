import { Fragment, isValidElement, ReactElement, ReactNode } from 'react';

import { Icon } from '../Icon';
import './Breadcrumbs.scss';

export interface BreadcrumbsProps {
  options: (ReactNode | { title: string; link?: string })[];
}

export const Breadcrumbs = ({ options }: BreadcrumbsProps) => (
  <div className="unique-breadcrumbs-wrapper">
    {options.map((option, index) => {
      const last = index === options.length - 1;
      return (
        <Fragment key={(option as ReactElement).key || index}>
          {index > 0 && (
            <Icon
              name="carret-right"
              size={8}
              color={last ? 'var(--color-blue-grey-300)' : 'var(--color-grey-500)'}
            />
          )}
          {last ? (
            isValidElement(option) ? (
              option
            ) : (
              <span className="breadcrumb-item">
                {(option as { title: string }).title}
              </span>
            )
          ) : isValidElement(option) ? (
            option
          ) : (
            <a className="breadcrumb-item" href={(option as { link: string })?.link}>
              {(option as { title: string })?.title}
            </a>
          )}
        </Fragment>
      );
    })}
  </div>
);
