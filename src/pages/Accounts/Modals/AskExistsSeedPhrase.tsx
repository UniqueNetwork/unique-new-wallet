import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Avatar, Button } from '@unique-nft/ui-kit';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { addressFromSeed } from '@app/utils';
import {
  AddressText,
  AddressWrapper,
  ButtonGroup,
  StepsTextStyled,
} from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import { LabelText } from '@app/pages/components/FormComponents';

import { TCreateAccountBodyModalProps } from './types';
import { defaultPairType, derivePath } from './CreateAccount';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';

export const AskExistsSeedPhrase: FC<TCreateAccountBodyModalProps> = ({ onFinish }) => {
  const [seed, setSeed] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    cryptoWaitReady().then(() => {
      keyring.loadAll({
        // todo <-- SS58
      });
    });
  }, []);

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
            {seed && <Avatar size={24} src={DefaultAvatar} />}
            <AddressText>
              {seed
                ? address
                : 'The account address will appear while entering the secret seed value'}
            </AddressText>
          </AddressWrapper>
        </ContentRow>
        <ContentRow>
          <LabelText>The secret seed value</LabelText>
          <SeedInput value={seed} rows={1} onChange={onSeedChange} />
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <StepsTextStyled size="m">Step 1/3</StepsTextStyled>
        <ButtonGroup>
          <Button disabled={!address} role="primary" title="Next" onClick={onNextClick} />
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
  font: inherit;
  resize: none;

  &:focus {
    border: 1px solid var(--color-grey-400);
  }
`;
