import React, { createRef, ReactNode, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Text } from '@unique-nft/ui-kit';

import emptyImage from '@app/static/icons/empty-image.svg';

export interface ITokenLinkProps {
  alt?: string;
  title: ReactNode;
  image?: string;
  meta?: ReactNode;
  onTokenClick?: () => void;
  onMetaClick?: () => void;
}

const TokenLinkWrapper = styled.div`
  width: 100%;
  max-width: 460px;
  font-family: var(--prop-font-family);
  font-size: var(--prop-font-size);
  font-weight: var(--prop-font-weight);
  cursor: pointer;
`;

const TokenLinkTitle = styled(Text).attrs({ appearance: 'block', size: 'l' })`
  margin-bottom: calc(var(--prop-gap) / 2);
  word-break: break-all;
`;

const TokenLinkImageWrapper = styled.div`
  overflow: hidden;
  border-radius: var(--prop-border-radius);
  position: relative;
  background-color: var(--color-blue-grey-100);
  margin-bottom: calc(var(--prop-gap) / 2);
  transform: translate3d(0, 0, 0);

  &::before {
    display: block;
    padding-bottom: 100%;
    content: '';
  }

  & > img {
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
      object-fit: contain;
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

export const TokenLink = ({
  alt,
  image,
  title,
  meta,
  onTokenClick,
  onMetaClick,
}: ITokenLinkProps) => {
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
    <TokenLinkWrapper>
      <div onClick={onTokenClick}>
        <TokenLinkImageWrapper>
          <img
            ref={imgRef}
            alt={alt}
            src={image || emptyImage}
            className={classNames({
              _broken: !image,
              _fullSize: isOverflow,
              _loaded: isLoaded,
            })}
            onLoad={renderImage}
          />
        </TokenLinkImageWrapper>
        {typeof title === 'string' ? <TokenLinkTitle>{title}</TokenLinkTitle> : title}
      </div>
      {meta && <div onClick={onMetaClick}>{meta}</div>}
    </TokenLinkWrapper>
  );
};
