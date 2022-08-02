import { VFC } from 'react';
import { Text } from '@unique-nft/ui-kit';
import { useResolvedPath, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { logUserEvent } from '@app/utils/logUserEvent';

interface MenuLinkProps {
  name: string;
  path?: string;
  logEvent: string;
}

const PointerWrapper = styled.span`
  cursor: pointer;
`;

export const MenuLink: VFC<MenuLinkProps> = ({ name, path = '', logEvent }) => {
  const resolved = useResolvedPath(path);
  const match = useMatch(`${resolved.pathname}/*`);
  const navigate = useNavigate();

  const clickToNavigate = (path: string, logEvent: string) => {
    logUserEvent(logEvent);
    navigate(path);
  };

  return (
    <PointerWrapper key={name} onClick={() => clickToNavigate(path, logEvent)}>
      <Text color={match ? 'additional-dark' : 'primary-500'} size="m">
        {name}
      </Text>
    </PointerWrapper>
  );
};

export default MenuLink;
