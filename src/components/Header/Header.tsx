import { VFC, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro'; // Todo: https://cryptousetech.atlassian.net/browse/NFTPAR-1201
import { Icon } from '@unique-nft/ui-kit';

import { useScreenWidthFromThreshold } from '@app/hooks';
import { MenuRoute, routes } from '@app/routesConfig';
import MobileMenuLink from '@app/components/Header/MobileMenuLink';

import { WalletManager } from './WalletManager/WalletManager';
import MenuLink from './MenuLink';

const { base, menuRoutes } = routes;

export const Header: VFC = () => {
  const { lessThanThreshold: showMobileMenu } = useScreenWidthFromThreshold(1279);
  const [mobileMenuIsOpen, toggleMobileMenu] = useState(false);

  const mobileMenuToggle = useCallback(() => {
    toggleMobileMenu((prevState) => !prevState);
  }, []);

  return (
    <HeaderStyled>
      <LeftSideColumn>
        {showMobileMenu && (
          <MenuIcon onClick={mobileMenuToggle}>
            <Icon name="menu" size={32} />
          </MenuIcon>
        )}
        <Link to={base}>
          <LogoIcon src="/logos/logo.svg" />
        </Link>

        {!showMobileMenu && (
          <nav>
            {menuRoutes.map((menuRoute: MenuRoute) => (
              <MenuLink
                key={menuRoute.name}
                name={menuRoute.name}
                path={menuRoute.path}
              />
            ))}
          </nav>
        )}
      </LeftSideColumn>
      <RightSide>
        <WalletManager />
      </RightSide>

      {showMobileMenu && mobileMenuIsOpen && (
        <MobileMenu>
          {menuRoutes.map((menuRoute: MenuRoute) => (
            <MobileMenuLink
              key={menuRoute.name}
              mobileMenuToggle={mobileMenuToggle}
              name={menuRoute.name}
              path={menuRoute.path}
            />
          ))}
        </MobileMenu>
      )}
    </HeaderStyled>
  );
};

const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  a {
    margin-right: 24px;
  }
`;

const LeftSideColumn = styled.div`
  display: flex;
  align-items: center;
`;

const MenuIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 8px;
`;

const LogoIcon = styled.img`
  margin-right: 32px;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 81px;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: var(--color-additional-light);
  box-shadow: inset 0 2px 8px rgb(0 0 0 / 6%);
  display: flex;
  flex-direction: column;
  padding: 16px;
  z-index: 9;
`;
