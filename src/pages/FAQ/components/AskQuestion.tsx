import { useNotifications } from '@unique-nft/ui-kit';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import {
  InputController,
  TextareaController,
} from '@app/components/FormControllerComponents';
import {
  AskQuestionRequestType,
  useAskQuestionRequest,
} from '@app/api/restApi/ask-question/useAskQuestionRequest';
import { Modal } from '@app/components/Modal';
import { DeviceSize, useDeviceSize, useFormValidator } from '@app/hooks';
import { config } from '@app/config';
import { ConfirmBtn, Button, Heading, Icon, Typography, Loader } from '@app/components';

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

export const AskQuestionComponent = () => {
  const [visibleModal, setVisibleModal] = useState(false);

  const size = useDeviceSize();
  const { isValid, errorMessage } = useFormValidator();
  const { handleSubmit, reset } = useFormContext<AskQuestionRequestType>();

  const { info, error } = useNotifications();
  const { createAskQuestionRequest, isLoadingRequestQuestion } = useAskQuestionRequest();

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
        <Typography>You can also find information in our community</Typography>
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
          <InputController
            name="name"
            label="Name *"
            className="input"
            id="name"
            rules={{
              required: {
                value: true,
                message: 'You did not fill in the required fields',
              },
            }}
          />
          <InputController
            name="email"
            label="Email *"
            className="input"
            id="email"
            rules={{
              required: {
                value: true,
                message: 'You did not fill in the required fields',
              },
              pattern: {
                value: emailValidationRegExp,
                message: 'Email is not correct',
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
              required: {
                value: true,
                message: 'You did not fill in the required fields',
              },
            }}
          />
          <ConfirmWrapper>
            <ConfirmBtn
              title="Send"
              role="primary"
              type="submit"
              disabled={!isValid}
              wide={size === DeviceSize.xs}
              tooltip={!isValid ? errorMessage : null}
              onClick={handleSubmit(onSubmit)}
            />
          </ConfirmWrapper>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

export const AskQuestion = () => {
  const form = useForm<AskQuestionRequestType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      question: '',
    },
  });

  return (
    <FormProvider {...form}>
      <AskQuestionComponent />
    </FormProvider>
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
`;

const ConfirmWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  button.unique-button {
    min-width: 300px;
  }
`;

const emailValidationRegExp =
  // eslint-disable-next-line no-control-regex
  /^(?:[a-z0-9]+([a-z0-9_\-.]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
