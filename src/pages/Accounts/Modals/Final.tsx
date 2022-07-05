import React, { FC, useCallback, useMemo } from 'react';
import { Avatar, Button, Icon, InputText, Tooltip } from '@unique-nft/ui-kit';

import {
  AddressText,
  AddressWrapper,
  ButtonGroup,
  LabelText,
  StepsTextStyled,
  TextWarning,
} from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';

import { defaultPairType, derivePath } from './CreateAccount';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';
import { TCreateAccountBodyModalProps } from './types';

export const FinalModal: FC<TCreateAccountBodyModalProps> = ({
  accountProperties,
  onFinish,
  onGoBack,
}) => {
  const onSaveClick = useCallback(() => {
    if (!accountProperties) {
      return;
    }

    onFinish(accountProperties);
  }, [accountProperties]);

  const shortSeed = useMemo(
    () =>
      accountProperties?.seed
        .split(' ')
        .map((value, index) => (index % 3 ? '…' : value))
        .join(' '),
    [accountProperties],
  );

  return (
    <>
      <ModalContent>
        <ContentRow>
          <AddressWrapper>
            <Avatar size={24} src={DefaultAvatar} />
            <AddressText>{accountProperties?.address || ''}</AddressText>
          </AddressWrapper>
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Partial seed
            <Tooltip
              content={
                <Icon name="question" size={20} color="var(--color-primary-500)" />
              }
              placement="right"
            >
              The seed is your key to the account. Knowing the seed allows you, or anyone
              else who knows the seed, to re-generate and control this account.
            </Tooltip>
          </LabelText>
          <InputText value={shortSeed} disabled={true} />
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Keypair type
            <Tooltip
              content={
                <Icon name="question" size={20} color="var(--color-primary-500)" />
              }
              placement="right"
            >
              Substrate supports a number of different crypto mechanisms. As such the
              keyring allows for the creation and management of different types of crypto.
            </Tooltip>
          </LabelText>
          <InputText value={defaultPairType} disabled={true} />
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Derivation path
            <Tooltip
              content={
                <Icon name="question" size={20} color="var(--color-primary-500)" />
              }
              placement="right"
            >
              If you would like to create and manage several accounts on the network using
              the same seed, you can use derivation paths.
            </Tooltip>
          </LabelText>
          <InputText value={derivePath || 'None provided'} disabled={true} />
        </ContentRow>
        <ContentRow>
          <TextWarning color="additional-warning-500" size="s">
            Consider storing your account in a signer such as a browser extension,
            hardware device, QR-capable phone wallet (non-connected) or desktop
            application for optimal account security. Future versions of the web-only
            interface will drop support for non-external accounts, much like the IPFS
            version.
          </TextWarning>
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <StepsTextStyled size="m">Step 3/3</StepsTextStyled>
        <ButtonGroup>
          <Button title="Previous" onClick={onGoBack} />
          <Button role="primary" title="Create account" onClick={onSaveClick} />
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};
