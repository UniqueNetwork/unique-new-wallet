import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { Avatar, Button, Checkbox, Text } from '@unique-nft/ui-kit';

import { addressFromSeed } from '@app/utils';

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
      <AddressWrapper>
        <Avatar size={24} src={DefaultAvatar} />
        <Text>{address}</Text>
      </AddressWrapper>
      <InputSeedWrapper>
        <SeedInput value={seed} onChange={onSeedChange} />
      </InputSeedWrapper>
      <TextStyled color="additional-warning-500" size="s">
        Ensure that you keep this seed in a safe place. Anyone with access to it can
        re-create the account and gain full access to it.
      </TextStyled>
      <ConfirmWrapperRow>
        <Checkbox
          label={'I have saved my mnemnic seed safely'}
          checked={confirmSeedSaved}
          size={'m'}
          onChange={setConfirmSeedSaved}
        />
      </ConfirmWrapperRow>
      <ButtonWrapper>
        <StepsTextStyled size={'m'}>Step 1/3</StepsTextStyled>
        <Button
          disabled={!address || !confirmSeedSaved}
          role="primary"
          title="Next"
          onClick={onNextClick}
        />
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

const InputSeedWrapper = styled.div`
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  padding: var(--gap);
  display: flex;
  margin-bottom: var(--gap);
`;

const SeedInput = styled.textarea`
  margin-bottom: 32px;
  width: 100%;
  border: none;
  height: auto;
  resize: none;
  outline: 0px none transparent;
`;

const TextStyled = styled(Text)`
  box-sizing: border-box;
  display: flex;
  padding: 8px 16px;
  margin: calc(var(--gap) * 1.5) 0;
  border-radius: 4px;
  background-color: var(--color-additional-warning-100);
  width: 100%;
`;

const ConfirmWrapperRow = styled.div`
  display: flex;
  margin-bottom: calc(var(--gap) * 1.5);
`;

const StepsTextStyled = styled(Text)`
  flex-grow: 1;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
