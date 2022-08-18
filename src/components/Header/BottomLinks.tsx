import { Icon } from '@unique-nft/ui-kit';
import { VFC } from 'react';
import styled from 'styled-components';

export const BottomLinks: VFC = () => {
  return (
    <Bottom>
      <div className="footer__text">
        Powered by{' '}
        <a target="_blank" href="/">
          Unique Network
        </a>{' '}
        — the NFT chain to build for Polkadot and Kusama.
      </div>
      <div className="footer__social">
        <a href="https://t.me/Uniquechain" target="_blank" rel="noreferrer">
          <Icon name="social-telegram" size={32} />
        </a>
        <a href="https://twitter.com/Unique_NFTchain" target="_blank" rel="noreferrer">
          <Icon name="social-twitter" size={32} />
        </a>
        <a href="https://discord.gg/jHVdZhsakC" target="_blank" rel="noreferrer">
          <Icon name="social-discord" size={32} />
        </a>
        <a href="https://github.com/UniqueNetwork" target="_blank" rel="noreferrer">
          <Icon name="social-github" size={32} />
        </a>
        <a
          href="https://app.subsocial.network/@UniqueNetwork_NFT"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="social-subsocial" size={32} />
        </a>
      </div>
    </Bottom>
  );
};

export const Bottom = styled.div`
  margin-top: auto;
  margin-bottom: 15px;
  border-top: 1px solid #d2d3d6;
  .footer__text {
    padding: 15px;
  }
  .footer__social {
    justify-content: start;
  }
`;
