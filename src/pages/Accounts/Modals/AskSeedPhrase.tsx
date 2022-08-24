import React, { FC, useCallback, useEffect, useState } from 'react';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import {
  Button,
  Checkbox,
  Heading,
  Icon,
  Link,
  Select,
  Textarea,
} from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { addressFromSeed } from '@app/utils';
import { Alert, IdentityIcon, Tooltip } from '@app/components';
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

import { defaultPairType, derivePath } from './CreateAccount';
import { TCreateAccountBodyModalProps } from './types';

const seedGenerators = [{ id: 'Mnemonic', title: 'Mnemonic' }];

export const AskSeedPhrase: FC<TCreateAccountBodyModalProps> = ({ onFinish }) => {
  const [seed, setSeed] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [confirmSeedSaved, setConfirmSeedSaved] = useState<boolean>(false);
  const [seedGenerator, setSeedGenerator] = useState('Mnemonic');

  const changeSeed = useCallback(
    (value: string) => {
      setSeed(value);
      const newAddress = addressFromSeed(value, derivePath, defaultPairType);
      setAddress(newAddress);
    },
    [setSeed],
  );

  const generateSeed = useCallback(() => {
    const seed = mnemonicGenerate();
    changeSeed(seed);
  }, [setSeed]);

  const onSeedGeneratorChange = useCallback((value) => {
    setSeedGenerator(value.id);
  }, []);

  const onSeedChange = (value: string) => {
    changeSeed(value);
  };

  useEffect(() => {
    generateSeed();
  }, []);

  const onNextClick = useCallback(() => {
    onFinish({ seed, address });
  }, [seed, address]);

  return (
    <>
      <ModalContent>
        <ContentRow>
          <AddressWrapper>
            <IdentityIcon address={address} />
            <AddressText>{address}</AddressText>
          </AddressWrapper>
        </ContentRow>
        <ContentRow>
          <Heading size="4">The secret seed value for this account</Heading>
          <ControlsGroup>
            <ControlWrapper>
              <Select
                options={seedGenerators}
                value={seedGenerator}
                onChange={onSeedGeneratorChange}
              />
              <ControlIcon className="align-middle">
                <Tooltip
                  title={
                    <>
                      Find out more on{' '}
                      <TooltipLink href="https://" title="Polkadot Wiki">
                        Polkadot Wiki
                      </TooltipLink>
                    </>
                  }
                >
                  <Icon size={24} name="question" color="var(--color-primary-500)" />
                </Tooltip>
              </ControlIcon>
            </ControlWrapper>
            <ControlWrapper>
              <Textarea value={seed} onChange={onSeedChange} />
              <ControlIcon role="button" onClick={generateSeed}>
                <Icon size={24} name="reload" color="inherit" />
              </ControlIcon>
            </ControlWrapper>
            <Alert type="warning">
              Ensure that you keep this seed in a safe place. Anyone with access to it can
              re-create the account and gain full access to it.
            </Alert>
            <Checkbox
              label="I have saved my mnemonic seed safely"
              checked={confirmSeedSaved}
              size="m"
              onChange={setConfirmSeedSaved}
            />
          </ControlsGroup>
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

const ControlWrapper = styled.div`
  display: flex;

  & > .unique-select,
  & > .unique-textarea-text {
    flex: 1 1 auto;
  }

  [role^='button'] {
    cursor: pointer;
    user-select: none;
  }
`;

const ControlIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: calc(var(--prop-gap) / 2);

  & > div {
    line-height: 1;
  }

  &.align-middle {
    margin-top: auto;
    margin-bottom: auto;
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--prop-gap);
  margin-top: var(--prop-gap);

  & > :last-child {
    align-self: baseline;
  }
`;

const TooltipLink = styled(Link)`
  border-bottom: 1px solid;
  color: inherit;
`;
