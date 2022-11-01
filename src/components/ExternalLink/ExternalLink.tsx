import { memo, ReactNode } from 'react';
import styled from 'styled-components';
import { Icon } from '@unique-nft/ui-kit';

interface ExternalLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

const ExternalLinkComponent = (props: ExternalLinkProps) => {
  const { children } = props;

  return (
    <a {...props} rel="noreferrer noopener" target="_blank">
      {children}
      <Icon color="currentColor" name="arrow-up-right" size={16} />
    </a>
  );
};

const ExternalLinkStyled = styled(ExternalLinkComponent)`
  color: var(--color-primary-500);
  line-height: 1.5;

  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.3em;
  }

  & > .icon {
    vertical-align: top;
    margin: 0.25em 0 0 0.125em;
  }
`;

export const ExternalLink = memo(ExternalLinkStyled);
