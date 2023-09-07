import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Modal } from '@app/components/Modal';
import { useAccounts } from '@app/hooks';
import { CONNECTED_WALLET_TYPE } from '@app/account/useWalletCenter';

export type IntroSliderProps = {
  activeSlide?: number;
  children:
    | (({
        activeSlide,
        setActiveSlide,
        setOpenModal,
      }: {
        activeSlide: number;
        setActiveSlide: Dispatch<SetStateAction<number>>;
        setOpenModal: Dispatch<SetStateAction<boolean>>;
      }) => JSX.Element)
    | (JSX.Element[] | JSX.Element);
};

const BUNDLE_SHOW_MODAL = 'new-wallet-bundle-show-modal';

const getConnectedWallets = localStorage.getItem(CONNECTED_WALLET_TYPE);

export const IntroSlider = ({ activeSlide = 0, children }: IntroSliderProps) => {
  const [active, setActive] = useState(activeSlide);
  const { selectedAccount } = useAccounts();
  const [open, setOpen] = useState(() => {
    if (!getConnectedWallets || getConnectedWallets.split(';').length === 0) {
      return false;
    }

    const status = localStorage.getItem(BUNDLE_SHOW_MODAL);
    return status ? JSON.parse(status) : true;
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    localStorage.setItem(BUNDLE_SHOW_MODAL, JSON.stringify(false));
  }, [open]);

  useEffect(() => {
    const status = localStorage.getItem(BUNDLE_SHOW_MODAL);
    if (!selectedAccount || (status !== null && !JSON.parse(status))) {
      return;
    }
    setOpen(true);
  }, [selectedAccount]);

  const renderContent = () => {
    if (typeof children === 'function') {
      const content = children({
        activeSlide,
        setActiveSlide: setActive,
        setOpenModal: setOpen,
      }).props.children;
      return Array.isArray(content) ? content : [content];
    }
    return Array.isArray(children) ? children : [children];
  };

  const content = renderContent();
  return (
    <Modal align="top" isVisible={open} onClose={() => setOpen(false)}>
      <div>{content[active]}</div>
      <Dots>
        {content.length > 1 &&
          content.map((_, idx) => (
            <Dot isActive={active === idx} key={idx} onClick={() => setActive(idx)} />
          ))}
      </Dots>
    </Modal>
  );
};

const Dots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  padding-bottom: 5px;
`;

const Dot = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ isActive }) =>
    isActive ? 'var(--color-primary-300)' : 'var(--color-primary-200)'};

  & + & {
    margin-left: 10px;
  }
`;
