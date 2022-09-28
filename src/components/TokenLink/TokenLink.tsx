import React, { ReactNode, useState } from 'react';
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
  font-family: var(--prop-font-family);
  font-size: var(--prop-font-size);
  font-weight: var(--prop-font-weight);
  word-break: break-all;
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
  transform: translateZ(0);

  &::before {
    display: block;
    padding-bottom: 100%;
    content: '';
  }

  & > img {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 100%;
    max-height: 100%;
    opacity: 0;
    transform: translate3d(-50%, -50%, 0);
    transition: opacity 0.15s linear;

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
  const [isLoaded, setLoaded] = useState(false);

  return (
    <TokenLinkWrapper>
      <div onClick={onTokenClick}>
        <TokenLinkImageWrapper>
          <img
            alt={alt}
            src={image || emptyImage}
            className={classNames({
              _loaded: isLoaded,
            })}
            onLoad={() => setLoaded(true)}
          />
        </TokenLinkImageWrapper>
        {typeof title === 'string' ? <TokenLinkTitle>{title}</TokenLinkTitle> : title}
      </div>
      {meta && <div onClick={onMetaClick}>{meta}</div>}
    </TokenLinkWrapper>
  );
};
