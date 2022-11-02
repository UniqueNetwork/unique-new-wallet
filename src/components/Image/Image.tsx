import { useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import emptyImage from '@app/static/icons/empty-image.svg';

const Wrapper = styled.div`
  overflow: hidden;
  border-radius: var(--prop-border-radius);
  position: relative;
  background-color: var(--color-blue-grey-100);
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

export const Image = ({
  alt = '',
  className,
  image,
}: {
  alt: string | undefined;
  className?: string;
  image: string | undefined;
}) => {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <Wrapper className={className}>
      <img
        alt={alt}
        src={image || emptyImage}
        className={classNames({
          _loaded: isLoaded,
        })}
        onLoad={() => setLoaded(true)}
      />
    </Wrapper>
  );
};
