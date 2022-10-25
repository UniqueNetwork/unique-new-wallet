import { Button, IAccount, Icon, INetwork } from '@unique-nft/ui-kit';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // Todo: https://cryptousetech.atlassian.net/browse/NFTPAR-1201

import { IdentityIcon } from '@app/components';
import { config } from '@app/config';
import { DeviceSize, useAccounts, useApi, useDeviceSize } from '@app/hooks';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { networks } from '@app/utils';
import { UserEvents } from '@app/utils/logUserEvent';

import logo from '../../static/icons/logo.svg';
import { AccountsManager } from '../AccountsManager';
import { Footer } from '../Footer';
import MenuLink from './MenuLink';

export const Header = () => {
  const navigate = useNavigate();
  const deviceSize = useDeviceSize();
  const { currentChain, setCurrentChain } = useApi();
  const { accounts, changeAccount, isLoading, selectedAccount } = useAccounts();
  const [isAccountManagerOpen, setAccountManagerOpen] = useState<boolean>(false);
  const [mobileMenuIsOpen, toggleMobileMenu] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<INetwork | undefined>(() =>
    networks.find(({ id }) => id === currentChain?.network),
  );
  const showMobileMenu = deviceSize <= DeviceSize.lg;

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

    setAccountManagerOpen(false);
  };

  const handleChangeNetwork = (val: INetwork) => {
    setCurrentChain(config.activeChains[val.id]);
    setAccountManagerOpen(false);
    navigate(`${val.id}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
  };

  const gotoManageBalance = () => {
    setAccountManagerOpen(false);
    navigate(`${activeNetwork?.id}/${ROUTE.ACCOUNTS}`);
  };

  return (
    <HeaderStyled>
      <LeftSideColumn>
        {showMobileMenu && (
          <MenuIcon onClick={mobileMenuToggle}>
            {mobileMenuIsOpen ? (
              <Icon name="close" size={20} color="var(--color-secondary-400)" />
            ) : (
              <Icon name="menu" size={32} />
            )}
          </MenuIcon>
        )}
        <Link to={ROUTE.BASE} onClick={() => showMobileMenu && toggleMobileMenu(false)}>
          <LogoIcon
            src={logo}
            className={classNames({
              'hidden-logo': !accounts.length,
            })}
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
            manageBalanceLinkTitle="Manage my balance"
            networks={networks}
            isTouch={deviceSize <= DeviceSize.xs}
            open={isAccountManagerOpen}
            stake={{
              visibility: true,
              disabled: true,
              onStake: () => {
                console.log('Stake!');
              },
              description:
                'Soon you can stake some of your holdings and earn a percentage-rate reward over time.',
            }}
            selectedAccount={{
              address: selectedAccount?.address,
              name: selectedAccount?.meta.name,
            }}
            symbol={selectedAccount?.unitBalance ?? ''}
            onAccountChange={onAccountChange}
            onManageBalanceClick={gotoManageBalance}
            onNetworkChange={(val) => handleChangeNetwork(val)}
            onOpenChange={(open) => setAccountManagerOpen(open)}
          />
        )}
        {!isLoading && !accounts.length && (
          <Button
            title="Create or connect account"
            className="create-account-btn account-group-btn-medium-font"
            onClick={gotoManageBalance}
          />
        )}
      </RightSide>

      {showMobileMenu && mobileMenuIsOpen && (
        <MobileModal>
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
              name="FAQ"
              path={`${activeNetwork?.id}/${ROUTE.FAQ}`}
              logEvent={UserEvents.HEADER_FAQ}
              mobileMenuToggle={mobileMenuToggle}
            />
          </MobileMenu>
          <FooterWrapper>
            <Footer />
          </FooterWrapper>
        </MobileModal>
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

  .unique-dropdown.touch {
    position: unset;

    .dropdown-options.touch {
      padding: calc(var(--prop-gap) * 1.5) var(--prop-gap);
      top: 100%;
      min-width: calc(100% - calc(var(--prop-gap) * 2));
      z-index: 3;
    }
  }
`;

const MobileModal = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  height: calc(100vh - 80px);
  background-color: var(--color-additional-light);
  box-shadow: inset 0 2px 8px rgb(0 0 0 / 6%);
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const MobileMenu = styled.nav`
  flex-direction: column;
  margin: 15px 0;
`;

const FooterWrapper = styled.div`
  display: flex;
  margin-top: auto;
  border-top: 1px solid var(--color-grey-300);
`;
