import React, { useMemo, VFC } from 'react';
import { Button, Heading, IconProps, Modal } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { ViewToken } from '@app/api';
import getSocialLink from '@app/pages/NFTDetails/Modals/utils/getSocialLink';

// TODO: need to move these icons to ui-kit
import RedditLogo from '../../../../static/icons/reddit.svg';
import FacebookLogo from '../../../../static/icons/facebook.svg';

interface ShareModalProps {
  isVisible: boolean;
  token: ViewToken;
  onClose(): void;
}

interface SocialItem {
  title: string;
  url: string;
  icon: IconProps;
}

export const ShareModal: VFC<ShareModalProps> = ({ isVisible, token, onClose }) => {
  const openLink = (url: string) => () => {
    window.open(url);
  };

  const socialItems: SocialItem[] = useMemo(
    () => [
      {
        title: 'Twitter',
        url: getSocialLink('twitter', {
          url: window.location.href,
          text: token.token_name,
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
          title: token.token_name,
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
          text: token.token_name,
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
          title: token.token_name,
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
  };

  return (
    <Modal isClosable isVisible={isVisible} onClose={onClose}>
      <HeadingWrapper>
        <Heading size="2">Share</Heading>
      </HeadingWrapper>
      <ButtonWrapper>
        {socialItems.map(({ title, url, icon }, index) => (
          <Button key={index} title={title} iconLeft={icon} onClick={openLink(url)} />
        ))}
      </ButtonWrapper>
      <ButtonWrapper>
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
  justify-content: space-between;
  margin-top: calc(var(--prop-gap) * 1.5);
  .unique-button {
    background-color: transparent;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    img {
      margin-right: var(--prop-gap);
    }
    &:hover {
      background-color: transparent;
      border: none;
      color: var(--color-primary-500);
    }
  }
`;

const HeadingWrapper = styled.div`
  && h2 {
    margin-bottom: calc(var(--prop-gap) * 2);
  }
`;
