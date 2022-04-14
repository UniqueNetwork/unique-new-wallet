import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { Button, Text } from '@unique-nft/ui-kit';

interface AccordionProps {
  title: string;
  isOpen?: boolean;
  isClearShow?: boolean;
  onClear?(): void;
}

const AccordionChevronIcon = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.96967 8.46967C4.26256 8.17678 4.73744 8.17678 5.03033 8.46967L12 15.4393L18.9697 8.46967C19.2626 8.17678 19.7374 8.17678 20.0303 8.46967C20.3232 8.76256 20.3232 9.23744 20.0303 9.53033L12.5303 17.0303C12.2374 17.3232 11.7626 17.3232 11.4697 17.0303L3.96967 9.53033C3.67678 9.23744 3.67678 8.76256 3.96967 8.46967Z'
        fill='#091941'
      />
    </svg>
  );
};

const Accordion: FC<AccordionProps> = ({
  title,
  isOpen: isOpenProps,
  children,
  onClear,
  isClearShow
}) => {
  const [isOpen, setIsOpen] = useState(isOpenProps);

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const onClearClick = useCallback(() => {
    onClear?.();
  }, [onClear]);

  return (
    <AccordionWrapper>
      <AccordionHeaderWrapper>
        <AccordionTitle onClick={onToggle} isOpen={isOpen}>
          <Text>{title}</Text>
          <AccordionChevronIcon />
        </AccordionTitle>
        {isClearShow && (
          <Button
            size={'small'}
            title={'Clear'}
            onClick={onClearClick}
            role={'danger'}
          />
        )}
      </AccordionHeaderWrapper>
      <AccordionBodyWrapper isOpen={isOpen}>{children}</AccordionBodyWrapper>
    </AccordionWrapper>
  );
};

const AccordionWrapper = styled.div``;

const AccordionHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  justify-content: space-between;
`;

const AccordionTitle = styled.div<{ isOpen?: boolean }>`
  display: flex;
  cursor: pointer;
  align-items: center;
  column-gap: calc(var(--gap) / 4);
  svg {
    transform-origin: center;
    transform: ${({ isOpen }) =>
      isOpen ? 'rotate(0deg);' : 'rotate(-90deg);'};
    transition: all 0.3s;
  }
`;

const AccordionBodyWrapper = styled.div<{ isOpen?: boolean }>`
  animation: ${({ isOpen }) =>
    isOpen ? 'show 0.3s forwards' : 'hide 0.3s forwards'};

  @keyframes hide {
    from {
      opacity: 1;
      max-height: 500px;
      visibility: visible;
    }
    to {
      opacity: 0;
      max-height: 0;
      visibility: hidden;
    }
  }
  @keyframes show {
    from {
      opacity: 0;
      max-height: 0;
      visibility: hidden;
    }
    to {
      opacity: 1;
      max-height: 500px;
      visibility: visible;
    }
  }
`;

export default Accordion;
