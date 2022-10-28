import { FC, useCallback, useMemo } from 'react';
import { Button, Icon, InputText } from '@unique-nft/ui-kit';

import { Alert, TooltipWrapper } from '@app/components';
import { LabelText, StepsTextStyled } from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import { ButtonGroup } from '@app/pages/components/FormComponents';
import { AddressWidget } from '@app/pages/Accounts/components/AddressWidget';
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';

import { defaultPairType, derivePath } from './CreateAccount';
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
          <AddressWidget address={accountProperties?.address} />
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Partial seed
            <TooltipWrapper
              align={DEFAULT_POSITION_TOOLTIP}
              message={
                <>
                  The seed is&nbsp;your key to&nbsp;the account. Knowing the seed allows
                  you, or&nbsp;anyone else who knows the seed, to&nbsp;re-generate and
                  control this account.
                </>
              }
            >
              <Icon name="question" size={20} color="var(--color-primary-500)" />
            </TooltipWrapper>
          </LabelText>
          <InputText value={shortSeed} disabled={true} />
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Keypair type
            <TooltipWrapper
              align={DEFAULT_POSITION_TOOLTIP}
              message={
                <>
                  Substrate supports a&nbsp;number of&nbsp;different crypto mechanisms.
                  As&nbsp;such the keyring allows for the creation and management
                  of&nbsp;different types of&nbsp;crypto.
                </>
              }
            >
              <Icon name="question" size={20} color="var(--color-primary-500)" />
            </TooltipWrapper>
          </LabelText>
          <InputText value={defaultPairType} disabled={true} />
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Derivation path
            <TooltipWrapper
              align={DEFAULT_POSITION_TOOLTIP}
              message={
                <>
                  If&nbsp;you would like to&nbsp;create and manage several accounts
                  on&nbsp;the network using the same seed, you can use derivation paths.
                </>
              }
            >
              <Icon name="question" size={20} color="var(--color-primary-500)" />
            </TooltipWrapper>
          </LabelText>
          <InputText value={derivePath || 'None provided'} disabled={true} />
        </ContentRow>
        <ContentRow>
          <Alert type="warning">
            Consider storing your account in&nbsp;a&nbsp;signer such
            as&nbsp;a&nbsp;browser extension, hardware device, QR-capable phone wallet
            (non-connected) or&nbsp;desktop application for optimal account security.
            Future versions of&nbsp;the web-only interface will drop support for
            non-external accounts, much like the IPFS version.
          </Alert>
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <StepsTextStyled size="m">Step 3/3</StepsTextStyled>
        <ButtonGroup stack>
          <Button title="Previous" onClick={onGoBack} />
          <Button role="primary" title="Create account" onClick={onSaveClick} />
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};
