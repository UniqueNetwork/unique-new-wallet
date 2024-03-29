import { FC, useCallback, useMemo, useState } from 'react';

import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { useAccounts } from '@app/hooks';
import { AskCredentialsModal, AskSeedPhrase } from '@app/pages';
import { Modal, useNotifications } from '@app/components';

import {
  CreateAccountModalStages,
  TAccountProperties,
  TCreateAccountBodyModalProps,
  TCreateAccountModalProps,
} from './types';
import { FinalModal } from './Final';

export const derivePath = '';

export const defaultPairType = 'sr25519';

export const CreateAccountModal: FC<TCreateAccountModalProps> = ({
  isVisible,
  onFinish,
}) => {
  const [stage, setStage] = useState<CreateAccountModalStages>(
    CreateAccountModalStages.AskSeed,
  );
  const [accountProperties, setAccountProperties] = useState<TAccountProperties>();
  const { addLocalAccount } = useAccounts();
  const { info } = useNotifications();

  const ModalBodyComponent = useMemo<FC<TCreateAccountBodyModalProps> | null>(() => {
    switch (stage) {
      case CreateAccountModalStages.AskSeed:
        return AskSeedPhrase;
      case CreateAccountModalStages.AskCredentials:
        return AskCredentialsModal;
      case CreateAccountModalStages.Final:
        return FinalModal;
      default:
        return null;
    }
  }, [stage]);

  const onStageFinish = useCallback(
    (accountProperties: TAccountProperties) => {
      if (stage === CreateAccountModalStages.Final) {
        if (!accountProperties) {
          return;
        }
        addLocalAccount(
          accountProperties.seed,
          derivePath,
          accountProperties.name || '',
          accountProperties.password || '',
          defaultPairType,
        );
        logUserEvent(UserEvents.CREATE_SUBSTRATE_STEP_3_NEXT);
        info('Account created');
        onFinish();
        setStage(CreateAccountModalStages.AskSeed);
        return;
      }
      if (stage === 0) {
        logUserEvent(UserEvents.CREATE_SUBSTRATE_STEP_1_NEXT);
      }
      if (stage === 1) {
        logUserEvent(UserEvents.CREATE_SUBSTRATE_STEP_2_NEXT);
      }
      setAccountProperties(accountProperties);
      setStage(stage + 1);
    },
    [stage],
  );

  const onGoBack = useCallback(() => {
    if (stage === CreateAccountModalStages.AskSeed) {
      return;
    }
    if (stage === CreateAccountModalStages.AskCredentials) {
      logUserEvent(UserEvents.CREATE_SUBSTRATE_STEP_2_PREVIOS);
    }
    if (stage === CreateAccountModalStages.Final) {
      logUserEvent(UserEvents.CREATE_SUBSTRATE_STEP_3_PREVIOS);
    }
    setStage(stage - 1);
  }, [stage]);

  if (!ModalBodyComponent) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} title="Create substrate account" onClose={onFinish}>
      <ModalBodyComponent
        accountProperties={accountProperties}
        onFinish={onStageFinish}
        onGoBack={onGoBack}
      />
    </Modal>
  );
};
