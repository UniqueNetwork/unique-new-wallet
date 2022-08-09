import { base64Decode, base64Encode } from '@polkadot/util-crypto';
import {
  Button,
  Heading,
  Icon,
  InputText,
  Modal,
  Text,
  Textarea,
  useNotifications,
} from '@unique-nft/ui-kit';
import axios from 'axios';
import React, { useState, VFC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

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

export const AskQuestion: VFC = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const { info, error } = useNotifications();
  return (
    <Wrapper>
      <Heading size="3">Didn&apos;t find the answer? Write&nbsp;to us.</Heading>
      <Button
        title="Ask a question"
        onClick={() => {
          setVisibleModal(true);
        }}
      />
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
      <Modal
        isVisible={visibleModal}
        isClosable={true}
        onClose={() => {
          setVisibleModal(false);
        }}
      >
        <Heading size="2">Ask a question</Heading>
        <ModalContent>
          <InputText
            label="Name *"
            className="input"
            value={name}
            onChange={(text) => {
              setName(text);
            }}
          />
          <InputText
            label="Email *"
            className="input"
            value={email}
            onChange={(text) => {
              setEmail(text);
            }}
          />
          <Textarea
            label="Question *"
            className="textarea"
            value={question}
            onChange={(text) => {
              setQuestion(text);
            }}
          />
          <Button
            title="Send"
            disabled={name === '' || email === '' || question === ''}
            role="primary"
            onClick={() => {
              axios
                .post(
                  'https://uniquenetwork.zendesk.com/api/v2/tickets',
                  {
                    ticket: {
                      comment: {
                        body: 'test',
                      },
                      priority: 'urgent',
                      subject: 'My printer is on fire!',
                    },
                  },
                  {
                    headers: {
                      Authorization: `Basic ${base64Encode(
                        'support@unique.network',
                      )}/token:kUzNDX6e6X4ycDCYBQ1Y6VrRYuRPChp7OUUjfbu0`,
                    },
                  },
                )
                .then(() => {
                  info('Your request has been accepted');
                  setVisibleModal(false);
                  setName('');
                  setEmail('');
                  setQuestion('');
                })
                .catch(() => {
                  error('An unexpected error has occurred. Please repeat your question');
                  setVisibleModal(false);
                });
            }}
          />
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  .input,
  .textarea {
    width: unset;
    margin-bottom: 30px;
    label {
      text-align: start;
      margin-bottom: 15px;
      font-weight: 400;
    }
  }
  .textarea {
    textarea {
      height: 114px;
    }
  }
  .unique-button {
    width: 88px;
    min-width: 88px;
    margin-left: auto;
  }
`;
