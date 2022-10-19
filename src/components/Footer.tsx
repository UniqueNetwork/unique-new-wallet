import { Icon } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { config } from '@app/config';

export const Footer = () => {
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
          <Icon name="social-telegram" color="var(--color-primary-500)" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.twitter} target="_blank" rel="noreferrer">
          <Icon name="social-twitter" color="var(--color-primary-500)" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.discord} target="_blank" rel="noreferrer">
          <Icon name="social-discord" color="var(--color-primary-500)" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.github} target="_blank" rel="noreferrer">
          <Icon name="social-github" color="var(--color-primary-500)" size={32} />
        </IconLink>
        <IconLink href={config.socialLinks.subsocial} target="_blank" rel="noreferrer">
          <Icon name="social-subsocial" color="var(--color-primary-500)" size={32} />
        </IconLink>
      </FooterLinks>
    </FooterWrapper>
  );
};

export const FooterWrapper = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: calc(var(--prop-gap));
  width: 100%;
  padding: var(--prop-gap);
  max-width: calc(var(--prop-container-width) - 64px);
  justify-content: space-between;
  @media screen and (min-width: 568px) {
    align-items: center;
    flex-direction: row;
    gap: calc(var(--prop-gap) * 2);
    padding: var(--prop-gap) calc(var(--prop-gap) * 2);
  }
  @media screen and (min-width: 1920px) {
    padding: var(--prop-gap) calc(var(--prop-gap) * 3);
  }
`;
export const FooterText = styled.div`
  color: var(--color-blue-grey-500);
  line-height: 22px;
`;
export const FooterLinks = styled.div`
  display: flex;
  gap: var(--prop-gap);
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
