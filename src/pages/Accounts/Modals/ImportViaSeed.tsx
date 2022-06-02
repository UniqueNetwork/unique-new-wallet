import React, { FC, useCallback, useMemo, useState } from 'react';
import { Heading, Modal } from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import { AskCredentialsModal, AskExistsSeedPhrase } from '@app/pages';
import { ModalHeader } from '@app/pages/Accounts/Modals/commonComponents';

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
