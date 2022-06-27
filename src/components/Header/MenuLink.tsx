import { VFC } from 'react';
import { Text } from '@unique-nft/ui-kit';
import { Link, useResolvedPath, useMatch } from 'react-router-dom';

interface MenuLinkProps {
  name: string;
  path?: string;
}

export const MenuLink: VFC<MenuLinkProps> = ({ name, path = '' }) => {
  const resolved = useResolvedPath(path);
  const match = useMatch(`${resolved.pathname}/*`);

  return (
    <Link key={name} to={path}>
      <Text color={match ? 'additional-dark' : 'primary-500'} size="m">
        {name}
      </Text>
    </Link>
  );
};

export default MenuLink;
