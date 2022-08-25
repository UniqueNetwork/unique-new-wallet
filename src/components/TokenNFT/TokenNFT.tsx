import { Text, Tooltip } from '@unique-nft/ui-kit';
import classNames from 'classnames';
import React, { createRef, ReactNode, useState } from 'react';
import styled from 'styled-components';

import emptyImage from '@app/static/icons/empty-image.svg';

export interface ITokenNFTProps {
  title: string;
  image?: string;
  type?: 'fractional' | 'bundle';
  link?: string;
  meta?: ReactNode;
  onTokenClick(): void;
  onMetaClick(): void;
}

export const TokenNFT = ({
  image,
  title,
  link,
  type,
  meta = (
    <Text size="s" color="primary-500" appearance="block">
      {link}
    </Text>
  ),
  onTokenClick,
  onMetaClick,
}: ITokenNFTProps) => {
  const imgRef = createRef<HTMLImageElement>();
  const [isOverflow, setOverflow] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const chips = {
    fractional: {
      name: 'Fractional',
      text: 'A fractional token provides a way for many users to own a part of an NFT',
    },
    bundle: {
      name: 'Bundle',
      text: 'A group of tokens nested in an NFT and having a nested, ordered, tree-like structure',
    },
  };

  const renderImage = () => {
    const overflow: boolean =
      !!imgRef.current?.parentElement &&
      (imgRef.current.offsetWidth >= imgRef.current.parentElement.offsetWidth ||
        imgRef.current.offsetHeight >= imgRef.current.parentElement.offsetWidth);
    setOverflow(overflow);
    setLoaded(true);
  };

  return (
    <TokenNFTWrapper>
      <div onClick={onTokenClick}>
        <TokenNFTImageWrapper>
          {type && (
            <Chips>
              {chips[type].name}
              <ChipsTooltip className="chips">{chips[type].text}</ChipsTooltip>
            </Chips>
          )}
          <img
            ref={imgRef}
            src={image || emptyImage}
            alt={title}
            className={classNames({
              _broken: image === '',
              _fullSize: isOverflow,
              _loaded: isLoaded,
            })}
            onLoad={renderImage}
          />
        </TokenNFTImageWrapper>
        <TokenNFTTitle>{title}</TokenNFTTitle>
      </div>
      <div onClick={onMetaClick}>{meta}</div>
    </TokenNFTWrapper>
  );
};

const ChipsTooltip = styled.div`
  visibility: hidden;
  position: absolute;
  top: 31px;
  right: 0;
  background: var(--color-additional-dark);
  color: var(--color-additional-light);
  padding: 8px 16px;
  border-radius: 2px;
  width: max-content;
  max-width: 260px;
  z-index: 2;

  @media (max-width: 1500px) {
    max-width: 240px;
  }
  &:after {
    position: absolute;
    top: -3px;
    right: 4px;
    content: '';
    width: 6px;
    height: 6px;
    transform: rotate(45deg);
    background-color: var(--color-secondary-500);
  }
`;

const Chips = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: var(--color-additional-light);
  border: 1px solid var(--color-blue-grey-200);
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 2;
  font-size: 16px;
  font-weight: 500;
  &:hover {
    .chips {
      visibility: visible;
    }
  }
`;

const TokenNFTWrapper = styled.div`
  width: 100%;
  max-width: 460px;
  font-family: var(--prop-font-family);
  font-size: var(--prop-font-size);
  font-weight: var(--prop-font-weight);
  cursor: pointer;
`;

const TokenNFTTitle = styled(Text).attrs({ appearance: 'block', size: 'l' })`
  margin-bottom: calc(var(--prop-gap) / 2);
  word-break: break-all;
`;

const TokenNFTImageWrapper = styled.div`
  overflow: hidden;
  position: relative;
  margin-bottom: var(--prop-gap);
  transform: translate3d(0, 0, 0);

  &::before {
    display: block;
    padding-bottom: 100%;
    content: '';
  }

  & > img {
    border-radius: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate3d(-50%, -50%, 0);
    transition: opacity 0.15s linear;

    &._fullSize {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: none;
      object-fit: cover;
    }

    &._broken {
      width: 100%;
      height: 100%;
      background-color: var(--color-blue-grey-100);
      object-fit: none;
    }

    &._loaded {
      opacity: 1;
    }
  }
`;
