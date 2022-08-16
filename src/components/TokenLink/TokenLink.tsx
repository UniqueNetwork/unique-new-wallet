import React, { createRef, ReactNode, useState } from 'react';
import { Text } from '@unique-nft/ui-kit';
import './TokenLink.scss';
import classNames from 'classnames';

import emptyImage from '@app/static/icons/empty-image.svg';

export interface ITokenLinkProps {
  title: string;
  image?: string;
  link?: string;
  meta?: ReactNode;
  onTokenClick(): void;
  onMetaClick(): void;
}

export const TokenLink = ({
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
}: ITokenLinkProps) => {
  const imgRef = createRef<HTMLImageElement>();
  const [isOverflow, setOverflow] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const renderImage = () => {
    const overflow: boolean =
      !!imgRef.current?.parentElement &&
      imgRef.current.offsetWidth >= imgRef.current.parentElement.offsetWidth;
    setOverflow(overflow);
    setLoaded(true);
  };

  return (
    <div className="unique-token-link">
      <div onClick={onTokenClick}>
        <div className="unique-token-image">
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
        </div>
        <Text size="l" appearance="block">
          {title}
        </Text>
      </div>
      <div onClick={onMetaClick}>{meta}</div>
    </div>
  );
};
