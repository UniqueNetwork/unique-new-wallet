import React, { VFC } from 'react';
import styled from 'styled-components';
import { Button, Heading, Icon, Text } from '@unique-nft/ui-kit';
import { Link as RouterLink } from 'react-router-dom';

import { SidePlateFooter } from './SidePlateFooter';
import { SocialNav } from './SocialNav';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .unique-button {
    min-width: 50%;
  }
`;

export const AskQuestion: VFC = () => (
  <Wrapper>
    <Heading size="3">Didn&apos;t find the answer? Write&nbsp;to us.</Heading>
    <Button title="Ask a question" />
    <SidePlateFooter>
      <Text>You can also find information in our community</Text>
      <SocialNav>
        <RouterLink
          to="https://t.me/Uniquechain"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="social-telegram" color="var(--color-primary-500)" size={32} />
        </RouterLink>
        <RouterLink
          to="https://twitter.com/Unique_NFTchain"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="social-twitter" color="var(--color-primary-500)" size={32} />
        </RouterLink>
        <RouterLink
          to="https://discord.gg/jHVdZhsakC"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="social-discord" color="var(--color-primary-500)" size={32} />
        </RouterLink>
        <RouterLink
          to="https://github.com/UniqueNetwork"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="social-github" color="var(--color-primary-500)" size={32} />
        </RouterLink>
        <RouterLink
          to="https://app.subsocial.network/@UniqueNetwork_NFT"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="social-subsocial" color="var(--color-primary-500)" size={32} />
        </RouterLink>
      </SocialNav>
    </SidePlateFooter>
  </Wrapper>
);
