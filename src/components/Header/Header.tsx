import { Text } from '@unique-nft/ui-kit';
import { FC, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro'; // Todo: https://cryptousetech.atlassian.net/browse/NFTPAR-1201

import { useScreenWidthFromThreshold } from '../../hooks/useScreenWidthFromThreshold';
import menu from '../../static/icons/menu.svg';
import { WalletManager } from './WalletManager/WalletManager';
import { TMenuItems } from '../PageLayout';

interface HeaderProps {
  activeItem: TMenuItems;
}

export const Header: FC<HeaderProps> = ({ activeItem }) => {
  const { lessThanThreshold: showMobileMenu } =
    useScreenWidthFromThreshold(1279);
  const [mobileMenuIsOpen, toggleMobileMenu] = useState(false);

  const mobileMenuToggle = useCallback(() => {
    toggleMobileMenu((prevState) => !prevState);
  }, []);

  return (
    <HeaderStyled>
      <LeftSideColumn>
        {showMobileMenu && <MenuIcon onClick={mobileMenuToggle} src={menu} />}
        <Link to={'/'}>
          <LogoIcon src={'/logos/logo.svg'} />
        </Link>
        {!showMobileMenu && (
          <nav>
            <Link to='/'>
              <Text
                color={
                  activeItem === 'Minter' ? 'additional-dark' : 'primary-500'
                }
                size='m'
                weight='medium'
              >
                Minter
              </Text>
            </Link>
          </nav>
        )}
      </LeftSideColumn>
      <RightSide>
        <WalletManager />
      </RightSide>
      {showMobileMenu && mobileMenuIsOpen && (
        <MobileMenu>
          <LinkWrapper onClick={mobileMenuToggle}>
            <Link to='/'>
              <TextStyled
                $active={activeItem === 'Minter'}
                color='additional-dark'
                size='m'
                weight='medium'
              >
                Minter
              </TextStyled>
            </Link>
          </LinkWrapper>
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

const LinkWrapper = styled.div`
  display: contents;

  a {
    margin-right: 0;
  }
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

const TextStyled = styled(Text)<{ $active?: boolean }>`
  && {
    display: flex;
    min-width: 100%;
    border-radius: 4px;
    padding: 8px 16px;
    background-color: ${(props) =>
      props.$active ? 'var(--color-primary-500)' : 'transparent'};
    color: ${(props) =>
      props.$active
        ? 'var(--color-additional-light)'
        : 'var(--color-additional-dark)'};

    &:hover {
      color: ${(props) =>
        props.$active
          ? 'var(--color-additional-light)'
          : 'var(--color-primary-500)'};
    }
  }
`;
