import { VFC, useCallback, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro'; // Todo: https://cryptousetech.atlassian.net/browse/NFTPAR-1201
import { AccountsManager } from '@unique-nft/ui-kit';

import { useAccounts, useApi, useScreenWidthFromThreshold } from '@app/hooks';
import menu from '@app/static/icons/menu.svg';
import { MenuRoute, routes } from '@app/routesConfig';
import MobileMenuLink from '@app/components/Header/MobileMenuLink';
import { networks } from '@app/utils';
import { ChainPropertiesContext } from '@app/context';

import MenuLink from './MenuLink';

const { base, menuRoutes } = routes;

// TODO - share IAccount from the UI kit
interface IAccount {
  address?: string;
  name?: string;
}

export const Header: VFC = () => {
  const { accounts, changeAccount, isLoading, selectedAccount } = useAccounts();
  const { chainProperties } = useContext(ChainPropertiesContext);
  const { currentChain, setCurrentChain } = useApi();
  const { lessThanThreshold: showMobileMenu } = useScreenWidthFromThreshold(1279);
  const [mobileMenuIsOpen, toggleMobileMenu] = useState(false);

  const mobileMenuToggle = useCallback(() => {
    toggleMobileMenu((prevState) => !prevState);
  }, []);

  const accountsForManager = accounts.map((account) => ({
    address: account.address,
    name: account.meta.name,
  }));

  const onAccountChange = (iAccount: IAccount) => {
    const targetAccount = accounts.find(
      (account) => account.address === iAccount.address,
    );

    if (targetAccount) {
      changeAccount(targetAccount);
    }
  };

  return (
    <HeaderStyled>
      <LeftSideColumn>
        {showMobileMenu && <MenuIcon src={menu} onClick={mobileMenuToggle} />}
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
        <AccountsManager
          accounts={accountsForManager}
          activeNetwork={currentChain}
          balance={selectedAccount?.balance ?? '0'}
          isLoading={isLoading}
          networks={networks}
          selectedAccount={{
            address: selectedAccount?.address,
            name: selectedAccount?.meta.name,
          }}
          symbol={chainProperties?.token ?? ''}
          onNetworkChange={setCurrentChain}
          onAccountChange={onAccountChange}
        />
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

const MenuIcon = styled.img`
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
