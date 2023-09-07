import React, { useMemo } from 'react';
import styled from 'styled-components';

import getSocialLink from '@app/pages/TokenDetails/Modals/utils/getSocialLink';
import { TBaseToken } from '@app/pages/TokenDetails/type';
import { TokenModalsProps } from '@app/pages/TokenDetails/Modals';
import { Button, Modal, IconProps, useNotifications } from '@app/components';

import RedditLogo from '../../../../static/icons/reddit.svg';
import FacebookLogo from '../../../../static/icons/facebook.svg';

interface SocialItem {
  title: string;
  url: string;
  icon: IconProps;
}

export const ShareModal = <T extends TBaseToken>({
  token,
  onClose,
}: Omit<TokenModalsProps<T> & { token: T }, 'onComplete'>) => {
  const { info } = useNotifications();
  const openLink = (url: string) => () => {
    window.open(url);
  };

  const socialItems: SocialItem[] = useMemo(
    () => [
      {
        title: 'Twitter',
        url: getSocialLink('twitter', {
          url: window.location.href,
          text: 'I’ve just created my @AngelHack #NFT as part of #PolkadotSocial:Seoul! 🔥\n\nCheck out this awesome customizable NFT!',
        }),
        icon: {
          name: 'social-twitter',
          size: 32,
        },
      },
      {
        title: 'Reddit',
        url: getSocialLink('reddit', {
          url: window.location.href,
          title: token.name,
        }),
        icon: {
          file: RedditLogo,
          size: 32,
        },
      },
      {
        title: 'Telegram',
        url: getSocialLink('telegram', {
          url: window.location.href,
          text: token.name,
        }),
        icon: {
          name: 'social-telegram',
          size: 32,
        },
      },
      {
        title: 'Facebook',
        url: getSocialLink('facebook', {
          url: window.location.href,
          title: token.name,
        }),
        icon: {
          file: FacebookLogo,
          size: 32,
        },
      },
    ],
    [token],
  );

  const onCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    info('Link copied successfully');
  };

  return (
    <Modal isVisible={true} title="Share" onClose={onClose}>
      <ButtonWrapper>
        <div className="share-button-group">
          {socialItems.map(({ title, url, icon }, index) => (
            <Button key={index} title={title} iconLeft={icon} onClick={openLink(url)} />
          ))}
        </div>
        <Button
          role="primary"
          title="Copy link"
          iconLeft={{
            name: 'copy',
            size: 32,
            color: 'var(--color-primary-500)',
          }}
          onClick={onCopyLink}
        />
      </ButtonWrapper>
    </Modal>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--prop-gap) * 1.5);

  .share-button-group {
    flex: 1 1 100%;
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--prop-gap) * 1.5) var(--prop-gap);

    .unique-button {
      box-sizing: border-box;
      flex: 1 0 100%;

      @media screen and (min-width: 320px) {
        flex: 0 1 48%;
      }

      @media screen and (min-width: 568px) {
        flex: 0;
      }
    }
  }

  .unique-button {
    border: none;
    justify-content: flex-end;
    padding: 0;
    color: inherit;
    background-color: transparent;

    &.with-icon.to-left {
      gap: calc(var(--prop-gap) / 2);

      & > .icon {
        margin: 0;
      }
    }

    &:hover {
      background-color: transparent;
      color: var(--color-primary-500);
    }
  }
`;
