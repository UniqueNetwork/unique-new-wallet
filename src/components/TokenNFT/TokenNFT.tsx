import React, { createRef, ReactNode, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Text } from '@unique-nft/ui-kit';

import emptyImage from '@app/static/icons/empty-image.svg';

export interface ITokenNFTProps {
  title: string;
  image?: string;
  link?: string;
  meta?: ReactNode;
  onTokenClick(): void;
  onMetaClick(): void;
}

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
    border-radius: var(--prop-border-radius);
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

export const TokenNFT = ({
  image,
  title,
  link,
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
