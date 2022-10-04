import {
  Button,
  Heading,
  Icon,
  Text,
  useNotifications,
  Loader,
} from '@unique-nft/ui-kit';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm, FormProvider } from 'react-hook-form';

import {
  InputController,
  TextareaController,
} from '@app/components/FormControllerComponents';
import {
  AskQuestionRequestType,
  useAskQuestionRequest,
} from '@app/api/restApi/ask-question/useAskQuestionRequest';
import { config } from '@app/config';
import { Modal } from '@app/components/Modal';

import { SidePlateFooter } from './SidePlateFooter';
import { SocialNav } from './SocialNav';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .unique-button {
    width: 100%;
    max-width: 280px;
  }
`;

export const AskQuestion = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const form = useForm<AskQuestionRequestType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      question: '',
    },
  });

  const { createAskQuestionRequest, isLoadingRequestQuestion } = useAskQuestionRequest();

  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = form;

  const onSubmit = (data: AskQuestionRequestType) => {
    createAskQuestionRequest(data)
      .then(() => {
        setVisibleModal(false);
        info('Your request has been accepted');
      })
      .catch(() => {
        error('An unexpected error has occurred. Please repeat your question');
      });
  };

  useEffect(() => {
    reset();
  }, [reset, visibleModal]);

  const { info, error } = useNotifications();
  return (
    <Wrapper>
      <Heading size="3">Didn&apos;t find the answer? Write to us.</Heading>
      <Button
        title="Ask a question"
        onClick={() => {
          setVisibleModal(true);
        }}
      />
      <SidePlateFooter>
        <Text>You can also find information in our community</Text>
        <SocialNav>
          <a href={config.socialLinks.telegram} target="_blank" rel="noreferrer noopener">
            <Icon name="social-telegram" color="currentColor" size={32} />
          </a>
          <a href={config.socialLinks.twitter} target="_blank" rel="noreferrer noopener">
            <Icon name="social-twitter" color="currentColor" size={32} />
          </a>
          <a href={config.socialLinks.discord} target="_blank" rel="noreferrer noopener">
            <Icon name="social-discord" color="currentColor" size={32} />
          </a>
          <a href={config.socialLinks.github} target="_blank" rel="noreferrer noopener">
            <Icon name="social-github" color="currentColor" size={32} />
          </a>
          <a
            href={config.socialLinks.subsocial}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Icon name="social-subsocial" color="var(--color-primary-500)" size={32} />
          </a>
        </SocialNav>
      </SidePlateFooter>
      <Modal
        isVisible={visibleModal}
        title="Ask a question"
        onClose={() => {
          setVisibleModal(false);
        }}
      >
        {isLoadingRequestQuestion && <Loader isFullPage={true} />}
        <ModalContent>
          <FormProvider {...form}>
            <InputController
              name="name"
              label="Name *"
              className="input"
              id="name"
              rules={{
                required: true,
              }}
            />
            <InputController
              name="email"
              label="Email *"
              className="input"
              id="email"
              rules={{
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              }}
            />
            <TextareaController
              name="question"
              label="Question *"
              className="textarea"
              id="question"
              rows={6}
              rules={{
                required: true,
              }}
            />

            <Button
              title="Send"
              disabled={!isValid}
              role="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            />
          </FormProvider>
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
      font-weight: 500;
    }
  }
  .unique-button {
    width: 88px;
    min-width: 88px;
    margin-left: auto;
  }
`;
