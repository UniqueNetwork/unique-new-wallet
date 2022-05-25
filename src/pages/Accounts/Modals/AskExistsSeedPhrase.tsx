import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { Avatar, Button, Checkbox, Text } from '@unique-nft/ui-kit';

import { addressFromSeed } from '@app/utils';
import {
  AddressWrapper,
  ButtonGroup,
  ContentRow,
  ModalContent,
  ModalFooter,
  StepsTextStyled,
  TextWarning,
} from '@app/pages/Accounts/Modals/commonComponents';

import { TCreateAccountBodyModalProps } from './types';
import { defaultPairType, derivePath } from './CreateAccount';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';

export const AskExistsSeedPhrase: FC<TCreateAccountBodyModalProps> = ({ onFinish }) => {
  const [seed, setSeed] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [confirmSeedSaved, setConfirmSeedSaved] = useState<boolean>(false);

  const changeSeed = useCallback(
    (value: string) => {
      setSeed(value);
      const newAddress = addressFromSeed(value, derivePath, defaultPairType);
      setAddress(newAddress);
    },
    [setSeed],
  );

  const onSeedChange = useCallback(({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    changeSeed(target.value);
  }, []);

  const onNextClick = useCallback(() => {
    onFinish({ seed, address });
  }, [seed, address]);

  return (
    <>
      <ModalContent>
        <ContentRow>
          <AddressWrapper>
            <Avatar size={24} src={DefaultAvatar} />
            <Text>{address}</Text>
          </AddressWrapper>
        </ContentRow>
        <ContentRow>
          <SeedInput value={seed} onChange={onSeedChange} />
        </ContentRow>
        <ContentRow>
          <TextWarning color="additional-warning-500" size="s">
            Ensure that you keep this seed in a safe place. Anyone with access to it can
            re-create the account and gain full access to it.
          </TextWarning>
        </ContentRow>
        <ContentRow>
          <Checkbox
            label="I have saved my mnemnic seed safely"
            checked={confirmSeedSaved}
            size="m"
            onChange={setConfirmSeedSaved}
          />
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <StepsTextStyled size="m">Step 1/3</StepsTextStyled>
        <ButtonGroup>
          <Button
            disabled={!address || !confirmSeedSaved}
            role="primary"
            title="Next"
            onClick={onNextClick}
          />
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

const SeedInput = styled.textarea`
  box-sizing: border-box;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--prop-border-radius);
  width: 100%;
  height: auto;
  padding: var(--prop-gap);
  outline: none;
  resize: none;

  &:focus {
    border: 1px solid var(--color-grey-400);
  }
`;
