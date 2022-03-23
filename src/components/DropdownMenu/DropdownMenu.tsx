import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DropdownMenuItemProps, DropdownMenuProps } from './types';
import styled from 'styled-components/macro';
import { Button } from '@unique-nft/ui-kit';
import CaretDown from '../../static/icons/caret-down.svg';
import { Icon } from '../Icon/Icon';

export const DropdownMenu: FC<DropdownMenuProps> = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const DropdownMenuButtonRef = useRef<HTMLDivElement | null>(null);

  const onDropdownClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (DropdownMenuButtonRef.current && !DropdownMenuButtonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('click', onClickOutside);
    };
  }, []);

  return (
    <DropdownMenuWrapper>
      <DropdownMenuButtonWrapper ref={DropdownMenuButtonRef}>
        <Button onClick={onDropdownClick} {...props} />
        <Icon path={CaretDown} size={16}/>
      </DropdownMenuButtonWrapper>
      <DropdownMenuDropdown isOpen={isOpen}>
        {children}
      </DropdownMenuDropdown>
    </DropdownMenuWrapper>
  );
};

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({ children, onClick }) => {
  return (
    <DropdownMenuItemWrapper onClick={onClick}>
      {children}
    </DropdownMenuItemWrapper>
  );
};

const DropdownMenuWrapper = styled.div`
  position: relative;
`;

const DropdownMenuButtonWrapper = styled.div`
  position: relative;
  button.unique-button {
    padding-right: calc(var(--gap) * 3);
  }
  span[class^=Icon] {
    position: absolute;
    margin-top: -8px;
    top: 50%;
    right: calc(var(--gap) * 1.5);
  }
`;

const DropdownMenuDropdown = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  position: absolute;
  width: 100%;
  top: calc(100% + 4px);
  flex-direction: column;
  background: var(--color-additional-light);
  box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
`;

const DropdownMenuItemWrapper = styled.div`
  padding: var(--gap);
  cursor: pointer;
  &:hover {
    background: var(--color-primary-100);
    color: var(--color-primary-500);
  }
`;
