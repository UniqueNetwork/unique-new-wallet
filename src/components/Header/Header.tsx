import { useCallback, useEffect, useState, VFC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro'; // Todo: https://cryptousetech.atlassian.net/browse/NFTPAR-1201
import { AccountsManager, Button, IAccount, Icon, INetwork } from '@unique-nft/ui-kit';

import { useAccounts, useApi, useScreenWidthFromThreshold } from '@app/hooks';
import { networks } from '@app/utils';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { config } from '@app/config';
import { defaultChainKey } from '@app/utils/configParser';
import { UserEvents } from '@app/utils/logUserEvent';
import { IdentityIcon } from '@app/components';

import MenuLink from './MenuLink';

export const Header: VFC = () => {
  const navigate = useNavigate();
  const { currentChain, setCurrentChain } = useApi();
  const { accounts, changeAccount, isLoading, selectedAccount } = useAccounts();
  const { lessThanThreshold: showMobileMenu } = useScreenWidthFromThreshold(800);
  const [mobileMenuIsOpen, toggleMobileMenu] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<INetwork | undefined>(() =>
    networks.find(({ id }) => id === currentChain?.network),
  );

  useEffect(() => {
    const active = networks.find(({ id }) => id === currentChain?.network);
    setActiveNetwork(active);
  }, [currentChain]);

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

  const createOrConnectAccountHandler = () => navigate(ROUTE.ACCOUNTS);

  const handleChangeNetwork = (val: INetwork) => {
    setActiveNetwork(val);
    setCurrentChain(config.chains[val.id]);
    localStorage.setItem(defaultChainKey, config.chains[val.id].network);
    navigate(`${activeNetwork?.id}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
  };

  return (
    <HeaderStyled>
      <LeftSideColumn>
        {showMobileMenu && (
          <MenuIcon onClick={mobileMenuToggle}>
            <Icon name="menu" size={32} />
          </MenuIcon>
        )}
        <Link to={ROUTE.BASE} onClick={() => showMobileMenu && toggleMobileMenu(false)}>
          <LogoIcon
            src="/logos/logo.svg"
            className={`${!accounts.length ? 'hidden-logo' : ''}`}
          />
        </Link>

        {!showMobileMenu && (
          <HeaderNav>
            <MenuLink
              name="My tokens"
              path={`${activeNetwork?.id}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`}
              logEvent={UserEvents.HEADER_MY_TOKENS}
            />
            <MenuLink
              name="My collections"
              path={`${activeNetwork?.id}/${ROUTE.MY_COLLECTIONS}`}
              logEvent={UserEvents.HEADER_MY_COLLECTION}
            />
            <MenuLink
              name="My accounts"
              path={`${activeNetwork?.id}/${ROUTE.ACCOUNTS}`}
              logEvent={UserEvents.HEADER_MY_ACCOUNTS}
            />
            <MenuLink
              name="FAQ"
              path={`${activeNetwork?.id}/${ROUTE.FAQ}`}
              logEvent={UserEvents.HEADER_FAQ}
            />
          </HeaderNav>
        )}
      </LeftSideColumn>
      <RightSide>
        {!isLoading && !!accounts.length && (
          <AccountsManager
            accounts={accountsForManager}
            avatarRender={(address: string) => <IdentityIcon address={address} />}
            activeNetwork={activeNetwork}
            balance={selectedAccount?.balance?.availableBalance.amount ?? '0'}
            isLoading={isLoading}
            networks={networks}
            selectedAccount={{
              address: selectedAccount?.address,
              name: selectedAccount?.meta.name,
            }}
            symbol={selectedAccount?.unitBalance ?? ''}
            onNetworkChange={(val) => handleChangeNetwork(val)}
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
          <MenuLink
            name="My tokens"
            path={`${activeNetwork?.id}/${ROUTE.MY_TOKENS}`}
            logEvent={UserEvents.HEADER_MY_TOKENS}
            mobileMenuToggle={mobileMenuToggle}
          />
          <MenuLink
            name="My collections"
            path={`${activeNetwork?.id}/${ROUTE.MY_COLLECTIONS}`}
            logEvent={UserEvents.HEADER_MY_COLLECTION}
            mobileMenuToggle={mobileMenuToggle}
          />
          <MenuLink
            name="My accounts"
            path={`${activeNetwork?.id}/${ROUTE.ACCOUNTS}`}
            logEvent={UserEvents.HEADER_MY_ACCOUNTS}
            mobileMenuToggle={mobileMenuToggle}
          />
          <MenuLink
            name="FAQ"
            path={`${activeNetwork?.id}/${ROUTE.FAQ}`}
            logEvent={UserEvents.HEADER_FAQ}
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
    display: flex;
    & > span {
      margin-right: calc(var(--prop-gap) / 1.5);
    }
  }
`;

const HeaderNav = styled.nav``;

const LeftSideColumn = styled.div`
  display: flex;
  align-items: center;
`;

const MenuIcon = styled.button.attrs({ type: 'button' })`
  appearance: none;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 calc(var(--prop-gap) / 2) 0 0;
  padding: 0;
  background: none transparent;
  cursor: pointer;
`;

const LogoIcon = styled.img`
  margin-right: calc(var(--prop-gap) * 2);
  @media (max-width: 700px) {
    width: 100px;
  }
  &.hidden-logo {
    @media (max-width: 500px) {
      display: none;
    }
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
`;

const MobileMenu = styled.nav`
  position: absolute;
  top: 81px;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: var(--color-additional-light);
  box-shadow: inset 0 2px 8px rgb(0 0 0 / 6%);
  display: flex;
  flex-direction: column;
  padding: var(--prop-gap);
  z-index: 9;
`;
