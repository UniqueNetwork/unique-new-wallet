import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // Todo: https://cryptousetech.atlassian.net/browse/NFTPAR-1201

import { Button, Icon, IdentityIcon, useNotifications } from '@app/components';
import { config } from '@app/config';
import { DeviceSize, useAccounts, useApi, useDeviceSize } from '@app/hooks';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import { networks } from '@app/utils';
import { UserEvents } from '@app/utils/logUserEvent';
import { Account } from '@app/account';
import { INetwork } from '@app/types';

import logo from '../../static/icons/logo.svg';
import { AccountsManager } from '../AccountsManager';
import { Footer } from '../Footer';
import MenuLink from './MenuLink';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const deviceSize = useDeviceSize();
  const { currentChain, setCurrentChain } = useApi();
  const { accounts, changeAccount, isLoading, selectedAccount } = useAccounts();
  const [isAccountManagerOpen, setAccountManagerOpen] = useState<boolean>(false);
  const [mobileMenuIsOpen, toggleMobileMenu] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<INetwork | undefined>(() =>
    networks.find(({ id }) => id === currentChain?.network),
  );
  const { error } = useNotifications();

  const showMobileMenu = deviceSize <= DeviceSize.lg;

  useEffect(() => {
    const active = networks.find(({ id }) => id === currentChain?.network);
    setActiveNetwork(active);
  }, [currentChain]);

  const mobileMenuToggle = useCallback(() => {
    toggleMobileMenu((prevState) => !prevState);
  }, []);

  const onAccountChange = (account: Account) => {
    try {
      changeAccount(account);
      setAccountManagerOpen(false);
    } catch (e: any) {
      error(e.message || `Failed to switch network ${currentChain.network}`);
    }
  };

  const handleChangeNetwork = async (val: INetwork) => {
    try {
      await selectedAccount?.changeChain(val.id);
      setCurrentChain(config.activeChains[val.id]);
      setAccountManagerOpen(false);
      navigate(`${val.id}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`);
    } catch (e: any) {
      error(e.message || `Failed to switch network ${val.id}`);
    }
  };

  const gotoManageBalance = () => {
    setAccountManagerOpen(false);
    navigate(`${activeNetwork?.id}/${ROUTE.ACCOUNTS}`);
  };

  const gotoConnectOrCreateWallet = () => {
    navigate(`${activeNetwork?.id}/${ROUTE.ACCOUNTS}`, {
      state: { openConnectWallet: true },
    });
  };

  const balance = useMemo(() => {
    const { formatted, amount } = selectedAccount?.balance?.availableBalance || {};

    if (!formatted || !amount || amount === '0') {
      return '0';
    }
    if (deviceSize < DeviceSize.xs) {
      if (!amount.includes('.')) {
        return amount;
      }
      return formatted.length > amount.slice(0, -5).length
        ? amount.slice(0, -5)
        : formatted;
    }
    return amount;
  }, [selectedAccount?.balance?.availableBalance.amount, deviceSize]);

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
              'hidden-logo': !accounts.size,
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
        {!isLoading && !!accounts.size && (
          <AccountsManager
            accounts={[...accounts.values()]}
            avatarRender={(address: string) => <IdentityIcon address={address} />}
            activeNetwork={activeNetwork}
            balance={balance}
            isLoading={isLoading}
            manageBalanceLinkTitle="Manage my balance"
            manageBalanceLink={`/${activeNetwork?.id}/${ROUTE.ACCOUNTS}`}
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
            selectedAccount={selectedAccount}
            symbol={selectedAccount?.unitBalance ?? ''}
            onAccountChange={onAccountChange}
            onManageBalanceClick={gotoManageBalance}
            onNetworkChange={(val) => handleChangeNetwork(val)}
            onOpenChange={(open) => setAccountManagerOpen(open)}
          />
        )}
        {!isLoading &&
          !accounts.size &&
          location.pathname !== `/${activeNetwork?.id}/${ROUTE.ACCOUNTS}` && (
            <Button
              title="Connect or create wallet"
              className="create-account-btn account-group-btn-medium-font"
              onClick={gotoConnectOrCreateWallet}
            />
          )}
      </RightSide>

      {showMobileMenu && mobileMenuIsOpen && (
        <MobileModal>
          <MobileMenu>
            <MenuLink
              name="My tokens"
              path={`${activeNetwork?.id}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`}
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
    margin-right: calc(var(--prop-gap) / 2);
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
      overflow-y: auto;
      height: calc(100vh - 130px);
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
