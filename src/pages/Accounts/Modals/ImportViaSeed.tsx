import React, { FC, useCallback, useMemo, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import { Modal } from '@app/components/Modal';
import { AskCredentialsModal, AskExistsSeedPhrase } from '@app/pages';

import {
  CreateAccountModalStages,
  TAccountProperties,
  TCreateAccountBodyModalProps,
  TCreateAccountModalProps,
} from './types';
import { FinalModal } from './Final';
import { defaultPairType, derivePath } from './CreateAccount';

export const ImportViaSeedAccountModal: FC<TCreateAccountModalProps> = ({
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
        return AskExistsSeedPhrase;
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
        info('Account added');
        onFinish();
        setStage(CreateAccountModalStages.AskSeed);
        return;
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

    setStage(stage - 1);
  }, [stage]);

  if (!ModalBodyComponent) {
    return null;
  }

  return (
    <Modal
      isVisible={isVisible}
      title="Add an account via seed phrase"
      onClose={onFinish}
    >
      <ModalBodyComponent
        accountProperties={accountProperties}
        onFinish={onStageFinish}
        onGoBack={onGoBack}
      />
    </Modal>
  );
};
