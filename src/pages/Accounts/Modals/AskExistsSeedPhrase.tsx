import { ChangeEvent, FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { mnemonicValidate } from '@polkadot/util-crypto';

import { addressFromSeed } from '@app/utils';
import { StatusText, StepsTextStyled } from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import { ButtonGroup, LabelText } from '@app/pages/components/FormComponents';
import { AddressWidget } from '@app/pages/Accounts/components/AddressWidget';
import { Button } from '@app/components';

import { TCreateAccountBodyModalProps } from './types';
import { defaultPairType, derivePath } from './CreateAccount';

export const AskExistsSeedPhrase: FC<TCreateAccountBodyModalProps> = ({ onFinish }) => {
  const [seed, setSeed] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isSeedValid, setIsSeedValid] = useState<boolean>(true);

  const changeSeed = useCallback(
    (value: string) => {
      setSeed(value);
      setIsSeedValid(mnemonicValidate(value));
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
          <AddressWidget address={address} empty={!seed} />
        </ContentRow>
        <ContentRow>
          <LabelText>The secret seed value</LabelText>
          <SeedInput
            isError={!isSeedValid}
            value={seed}
            rows={1}
            onChange={onSeedChange}
          />
          {!isSeedValid && <StatusText>Invalid seed value</StatusText>}
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <StepsTextStyled size="m">Step 1/3</StepsTextStyled>
        <ButtonGroup stack>
          <Button
            disabled={!address || !isSeedValid}
            role="primary"
            title="Next"
            onClick={onNextClick}
          />
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

const SeedInput = styled.textarea<{ isError: boolean }>`
  box-sizing: border-box;
  border: 1px solid
    var(${({ isError }) => (isError ? '--color-coral-500' : '--color-grey-300')});
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
