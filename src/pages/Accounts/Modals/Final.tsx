import React, { FC, useCallback, useMemo } from 'react';
import { Avatar, Button, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { Icon, Tooltip } from '@app/components';

import { defaultPairType, derivePath } from './CreateAccount';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';
import { TCreateAccountBodyModalProps } from './types';
import Question from '../../../static/icons/question.svg';

export const FinalModal: FC<TCreateAccountBodyModalProps> = ({
  accountProperties,
  onFinish,
  onGoBack,
}) => {
  const onSaveClick = useCallback(() => {
    if (!accountProperties) return;
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
      <AddressWrapper>
        <Avatar size={24} src={DefaultAvatar} />
        <Text>{accountProperties?.address || ''}</Text>
      </AddressWrapper>
      <CredentialsWrapper>
        <LabelTextWrapper>
          <Text size={'m'}>Partial seed</Text>
          <Tooltip
            title={
              'The seed is your key to the account. Knowing the seed allows you, or anyone else who knows the seed, to re-generate and control this account.'
            }
            placement={'right'}
          >
            <Icon path={Question} />
          </Tooltip>
        </LabelTextWrapper>
        <ValueTextStyled>{shortSeed}</ValueTextStyled>
        <LabelTextWrapper>
          <Text size={'m'}>Keypair type</Text>
          <Tooltip
            title={
              'Substrate supports a number of different crypto mechanisms. As such the keyring allows for the creation and management of different types of crypto.'
            }
            placement={'right'}
          >
            <Icon path={Question} />
          </Tooltip>
        </LabelTextWrapper>
        <ValueTextStyled>{defaultPairType}</ValueTextStyled>
        <LabelTextWrapper>
          <Text size={'m'}>Derivation path</Text>
          <Tooltip
            title={
              'If you would like to create and manage several accounts on the network using the same seed, you can use derivation paths.'
            }
            placement={'right'}
          >
            <Icon path={Question} />
          </Tooltip>
        </LabelTextWrapper>
        <ValueTextStyled>{derivePath || 'None provided'}</ValueTextStyled>
      </CredentialsWrapper>
      <TextStyled color="additional-warning-500" size="s">
        Consider storing your account in a signer such as a browser extension, hardware
        device, QR-capable phone wallet (non-connected) or desktop application for optimal
        account security. Future versions of the web-only interface will drop support for
        non-external accounts, much like the IPFS version.
      </TextStyled>
      <TextStyled color="additional-warning-500" size="s">
        You will be provided with a generated backup file after your account is created.
        Please make sure to save this file in a secure location as it is required,
        together with your password, to restore your account.
      </TextStyled>
      <ButtonWrapper>
        <StepsTextStyled size={'m'}>Step 3/3</StepsTextStyled>
        <Button title="Previous" onClick={onGoBack} />
        <Button role="primary" title="Save" onClick={onSaveClick} />
      </ButtonWrapper>
    </>
  );
};

const AddressWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--gap) / 2);
  margin: calc(var(--gap) * 2) 0;
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  padding: 20px var(--gap);
`;

const StepsTextStyled = styled(Text)`
  flex-grow: 1;
`;

const LabelTextWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--gap) / 4);
`;

const TextStyled = styled(Text)`
  box-sizing: border-box;
  display: flex;
  padding: 8px 16px;
  margin: var(--gap) 0;
  border-radius: 4px;
  background-color: var(--color-additional-warning-100);
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: var(--gap);
`;

const CredentialsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--gap) / 2);
  margin-bottom: calc(var(--gap) * 1.5);
  .unique-input-text {
    width: 100%;
  }
`;

const ValueTextStyled = styled.div`
  border: 1px solid var(--color-grey-300);
  padding: 11px 12px;
  border-radius: 4px;
`;
