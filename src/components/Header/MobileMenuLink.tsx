import { VFC } from 'react';
import styled from 'styled-components/macro';
import { Link, useResolvedPath, useMatch } from 'react-router-dom';
import { Text } from '@unique-nft/ui-kit';

interface MenuLinkProps {
  mobileMenuToggle: () => void;
  name: string;
  path: string;
}

export const MobileMenuLink: VFC<MenuLinkProps> = ({ mobileMenuToggle, name, path }) => {
  const resolved = useResolvedPath(path);
  const match = useMatch(`${resolved.pathname}/*`);

  return (
    <LinkWrapper key={name} onClick={mobileMenuToggle}>
      <Link to={path}>
        <TextStyled $active={!!match} color="additional-dark" size="m">
          {name}
        </TextStyled>
      </Link>
    </LinkWrapper>
  );
};

const LinkWrapper = styled.div`
  display: contents;

  a {
    margin-right: 0;
  }
`;

const TextStyled = styled(Text)<{ $active?: boolean }>`
  && {
    display: flex;
    border-radius: 4px;
    padding: 8px 16px;
    background-color: ${(props) =>
      props.$active ? 'var(--color-primary-500)' : 'transparent'};
    color: ${(props) =>
      props.$active ? 'var(--color-additional-light)' : 'var(--color-additional-dark)'};

    &:hover {
      color: ${(props) =>
        props.$active ? 'var(--color-additional-light)' : 'var(--color-primary-500)'};
    }
  }
`;

export default MobileMenuLink;
