import { Icon } from '@unique-nft/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { config } from '@app/config';

export const Footer: FC = () => {
  return (
    <FooterWrapper>
      <FooterText>
        Powered by{' '}
        <TextLink target="_blank" href={config.socialLinks.homepage} rel="noreferrer">
          Unique Network
        </TextLink>{' '}
        — the NFT chain to build for Polkadot and Kusama.{' '}
        {config.version ? `Version ${config.version}` : ''}
      </FooterText>
      <FooterLinks>
        <IconLink href={config.socialLinks.telegram} target="_blank" rel="noreferrer">
          <Icon name="social-telegram" color="#009CF0" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.twitter} target="_blank" rel="noreferrer">
          <Icon name="social-twitter" color="#009CF0" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.discord} target="_blank" rel="noreferrer">
          <Icon name="social-discord" color="#009CF0" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.github} target="_blank" rel="noreferrer">
          <Icon name="social-github" color="#009CF0" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.subsocial} target="_blank" rel="noreferrer">
          <Icon name="social-subsocial" color="#009CF0" size={32} />
        </IconLink>
      </FooterLinks>
    </FooterWrapper>
  );
};

export const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 10px 24px;
  max-width: calc(var(--prop-container-width) - 64px);
  justify-content: space-between;
  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 567px) {
    flex-direction: column;
    align-items: start;
    gap: 15px;
  }
`;
export const FooterText = styled.div`
  color: var(--color-blue-grey-500);
  line-height: 22px;
`;
export const FooterLinks = styled.div`
  display: flex;
  gap: 16px;
`;
export const TextLink = styled.a`
  color: var(--color-primary-500);
  &:hover {
    text-decoration: underline;
  }
`;
export const IconLink = styled.a`
  display: flex;
  align-items: center;
`;
