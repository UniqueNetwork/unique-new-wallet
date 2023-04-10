import { ReactNode } from 'react';
import styled from 'styled-components';

import { Image, Typography } from '@app/components';

export interface ITokenLinkProps {
  alt?: string;
  title: ReactNode;
  image?: string;
  meta?: ReactNode;
  onTokenClick?: () => void;
  onMetaClick?: () => void;
  badge?: ReactNode;
}

const TokenLinkWrapper = styled.div`
  width: 100%;
  font-family: var(--prop-font-family);
  font-size: var(--prop-font-size);
  font-weight: var(--prop-font-weight);
  word-break: break-all;
  cursor: pointer;
`;

const TokenLinkImageWrapper = styled.div`
  position: relative;
`;

const TokenImage = styled(Image)`
  margin-bottom: calc(var(--prop-gap) / 2);
`;

const TokenLinkTitle = styled(Typography).attrs({ appearance: 'block', size: 'l' })`
  margin-bottom: calc(var(--prop-gap) / 2);
  word-break: break-all;
`;

export const TokenLink = ({
  alt,
  image,
  title,
  meta,
  onTokenClick,
  onMetaClick,
  badge,
}: ITokenLinkProps) => {
  return (
    <TokenLinkWrapper>
      <div onClick={onTokenClick}>
        <TokenLinkImageWrapper>
          {badge}
          <TokenImage alt={alt} image={image} />
        </TokenLinkImageWrapper>
        {typeof title === 'string' ? <TokenLinkTitle>{title}</TokenLinkTitle> : title}
      </div>
      {meta && <div onClick={onMetaClick}>{meta}</div>}
    </TokenLinkWrapper>
  );
};
