import { ReactNode } from 'react';

import { BackLink, Breadcrumbs, BreadcrumbsProps, Heading, Icon } from '..';
import './Layout.scss';

export interface LayoutProps {
  children: ReactNode;
  heading?: string;
  breadcrumbs?: BreadcrumbsProps;
  header?: ReactNode;
  footer?: ReactNode;
  backLink?: string | null;
}

export const Layout = ({
  children,
  heading,
  breadcrumbs,
  header,
  footer,
  backLink,
}: LayoutProps) => (
  <div className="unique-layout">
    <header>{header || null}</header>
    <main>
      {heading && <Heading>{heading}</Heading>}
      {backLink && <BackLink link={backLink} />}
      {breadcrumbs && <Breadcrumbs {...breadcrumbs} />}

      <div className="unique-layout__content">{children}</div>
    </main>
    <footer>
      {footer || (
        <>
          <div className="footer__text">
            Powered by{' '}
            <a target="_blank" href="/" rel="noreferrer">
              Unique Network
            </a>{' '}
            — the NFT chain to build for Polkadot and Kusama. Version 22.18.1560
          </div>
          <div className="footer__social">
            <a href="https://t.me/Uniquechain" target="_blank" rel="noreferrer">
              <Icon name="social-telegram" color="#009CF0" size={32} />
            </a>
            <a
              href="https://twitter.com/Unique_NFTchain"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="social-twitter" color="#009CF0" size={32} />
            </a>
            <a href="https://discord.gg/jHVdZhsakC" target="_blank" rel="noreferrer">
              <Icon name="social-discord" color="#009CF0" size={32} />
            </a>
            <a href="https://github.com/UniqueNetwork" target="_blank" rel="noreferrer">
              <Icon name="social-github" color="#009CF0" size={32} />
            </a>
            <a
              href="https://app.subsocial.network/@UniqueNetwork_NFT"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="social-subsocial" color="#009CF0" size={32} />
            </a>
          </div>
        </>
      )}
    </footer>
  </div>
);
