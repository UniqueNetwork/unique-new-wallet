import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';

import { Modal } from '@app/components/Modal';

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

export const IntroSlider = ({ activeSlide = 0, children }: IntroSliderProps) => {
  const [active, setActive] = useState(activeSlide);
  const [open, setOpen] = useState(true);

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

  return (
    <Modal isVisible={open} onClose={() => setOpen(false)}>
      <div>{renderContent()[active]}</div>
      <Dots>
        {renderContent().map((_, idx) => (
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
