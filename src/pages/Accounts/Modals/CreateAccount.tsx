import React, { FC, useCallback, useMemo, useState } from 'react';
import { Heading, Modal } from '@unique-nft/ui-kit';

import { AskCredentialsModal, AskSeedPhrase } from '@app/pages';
import { useAccounts } from '@app/hooks';
import { ModalHeader } from '@app/pages/Accounts/Modals/commonComponents';

import {
  TCreateAccountModalProps,
  CreateAccountModalStages,
  TAccountProperties,
  TCreateAccountBodyModalProps,
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
        if (!accountProperties) return;
        addLocalAccount(
          accountProperties.seed,
          derivePath,
          accountProperties.name || '',
          accountProperties.password || '',
          defaultPairType,
        );

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
    if (stage === CreateAccountModalStages.AskSeed) return;
    setStage(stage - 1);
  }, [stage]);

  if (!ModalBodyComponent) return null;

  return (
    <Modal isVisible={isVisible} isClosable={true} onClose={onFinish}>
      <ModalHeader>
        <Heading size="2">Add an account via seed phrase</Heading>
      </ModalHeader>
      <ModalBodyComponent
        accountProperties={accountProperties}
        onFinish={onStageFinish}
        onGoBack={onGoBack}
      />
    </Modal>
  );
};
