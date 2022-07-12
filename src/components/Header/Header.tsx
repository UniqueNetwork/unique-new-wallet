import { VFC, useCallback, useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro'; // Todo: https://cryptousetech.atlassian.net/browse/NFTPAR-1201
import { AccountsManager, Button, Icon, INetwork } from '@unique-nft/ui-kit';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';

import { useAccounts, useApi, useScreenWidthFromThreshold } from '@app/hooks';
import MobileMenuLink from '@app/components/Header/MobileMenuLink';
import { networks } from '@app/utils';
import { ChainPropertiesContext } from '@app/context';
import { ROUTE } from '@app/routes';
import { config } from '@app/config';
import { defaultChainKey } from '@app/utils/configParser';

import MenuLink from './MenuLink';

// TODO - share IAccount from the UI kit
interface IAccount {
  address?: string;
  name?: string;
}

export const Header: VFC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentChain, setCurrentChain } = useApi();
  const { chainProperties } = useContext(ChainPropertiesContext);
  const { accounts, changeAccount, isLoading, selectedAccount } = useAccounts();
  const { lessThanThreshold: showMobileMenu } = useScreenWidthFromThreshold(1279);
  const [mobileMenuIsOpen, toggleMobileMenu] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<INetwork | undefined>(() =>
    networks.find(({ id }) => id === currentChain?.network),
  );

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

  useEffect(() => {
    cryptoWaitReady().then(() => {
      keyring.loadAll({});
    });

    const partsUrl = location.pathname.split('/');
    const networkFromUrl = networks.find(({ id }) => id === partsUrl[1].toUpperCase());
    if (networkFromUrl) {
      setActiveNetwork(networkFromUrl);
      setCurrentChain(config.chains[networkFromUrl.id]);
    }
  }, []);

  useEffect(() => {
    // todo keyring.loadAll({ <-- SS58, GenesisHash })
  }, [chainProperties]);

  const createOrConnectAccountHandler = () => navigate(ROUTE.ACCOUNTS);

  const handleChangeNetwork = (val: INetwork) => {
    setActiveNetwork(val);
    setCurrentChain(config.chains[val.id]);
    localStorage.setItem(defaultChainKey, config.chains[val.id].network);

    const partsUrl = location.pathname.split('/');
    partsUrl[1] = val.id;
    const newlink = partsUrl.join('/');
    navigate(newlink);
  };

  return (
    <HeaderStyled>
      <LeftSideColumn>
        {showMobileMenu && (
          <MenuIcon onClick={mobileMenuToggle}>
            <Icon name="menu" size={32} />
          </MenuIcon>
        )}
        <Link to={ROUTE.BASE}>
          <LogoIcon src="/logos/logo.svg" />
        </Link>

        {!showMobileMenu && (
          <nav>
            <MenuLink name="My tokens" path={`${activeNetwork?.id}/${ROUTE.MY_TOKENS}`} />
            <MenuLink
              name="My collections"
              path={`${activeNetwork?.id}/${ROUTE.MY_COLLECTIONS}`}
            />
            <MenuLink
              name="My accounts"
              path={`${activeNetwork?.id}/${ROUTE.ACCOUNTS}`}
            />
            <MenuLink name="FAQ" path={`${activeNetwork?.id}/${ROUTE.FAQ}`} />
          </nav>
        )}
      </LeftSideColumn>
      <RightSide>
        {!isLoading && !!accounts.length && (
          <AccountsManager
            accounts={accountsForManager}
            activeNetwork={activeNetwork}
            balance={selectedAccount?.balance?.availableBalance.amount ?? '0'}
            isLoading={isLoading}
            networks={networks}
            selectedAccount={{
              address: selectedAccount?.address,
              name: selectedAccount?.meta.name,
            }}
            symbol={selectedAccount?.unitBalance ?? ''}
            onNetworkChange={handleChangeNetwork}
            onAccountChange={onAccountChange}
          />
        )}
        {!isLoading && !accounts.length && (
          <Button
            title="Create or connect account"
            className="create-account-btn account-group-btn-medium-font"
            onClick={createOrConnectAccountHandler}
          />
        )}
      </RightSide>

      {showMobileMenu && mobileMenuIsOpen && (
        <MobileMenu>
          <MobileMenuLink
            name="My tokens"
            path={`${activeNetwork?.id}/${ROUTE.MY_TOKENS}`}
            mobileMenuToggle={mobileMenuToggle}
          />
          <MobileMenuLink
            name="My collections"
            path={`${activeNetwork?.id}/${ROUTE.MY_COLLECTIONS}`}
            mobileMenuToggle={mobileMenuToggle}
          />
          <MobileMenuLink
            name="My accounts"
            path={`${activeNetwork?.id}/${ROUTE.ACCOUNTS}`}
            mobileMenuToggle={mobileMenuToggle}
          />
          <MobileMenuLink
            name="FAQ"
            path={`${activeNetwork?.id}/${ROUTE.FAQ}`}
            mobileMenuToggle={mobileMenuToggle}
          />
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

  nav {
    & > a {
      margin-right: 24px;
    }
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
