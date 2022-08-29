import { VFC } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import classNames from 'classnames';
import styled from 'styled-components';

import { logUserEvent } from '@app/utils/logUserEvent';

interface MenuLinkProps {
  logEvent: string;
  name: string;
  path?: string;
  mobileMenuToggle?: () => void;
}

const LinkStyled = styled(Link)`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;

  &._isMobile {
    border-radius: var(--prop-border-radius);
    padding: 12px 24px;
    color: var(--color-primary-500);

    &._isActive {
      color: var(--color-additional-dark);
    }
  }

  &:not(._isMobile) {
    color: var(--color-primary-500);

    &._isActive {
      color: var(--color-additional-dark);
    }

    & + & {
      margin-left: calc(var(--prop-gap) * 1.5);
    }
  }
`;

export const MenuLink: VFC<MenuLinkProps> = ({
  logEvent,
  name,
  path = '',
  mobileMenuToggle,
}) => {
  const resolved = useResolvedPath(path);
  const match = useMatch(`${resolved.pathname}/*`);

  const menuClickHandle = (logEvent: string) => {
    logUserEvent(logEvent);
    mobileMenuToggle?.();
  };

  return (
    <LinkStyled
      className={classNames({ _isMobile: mobileMenuToggle, _isActive: !!match })}
      key={name}
      to={path}
      onClick={() => menuClickHandle(logEvent)}
    >
      {name}
    </LinkStyled>
  );
};

export default MenuLink;
