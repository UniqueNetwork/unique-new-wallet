import { createRef, FC, useCallback, useMemo } from 'react';
import {
  Avatar,
  Button,
  Icon,
  InputText,
  Tooltip,
  TooltipAlign,
} from '@unique-nft/ui-kit';

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

const keypairTooltip = createRef<HTMLDivElement>();
const pathTooltip = createRef<HTMLDivElement>();
const seedTooltip = createRef<HTMLDivElement>();
const tooltipAlign: TooltipAlign = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
};

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
            <Tooltip align={tooltipAlign} targetRef={seedTooltip}>
              The seed is&nbsp;your key to&nbsp;the account. Knowing the seed allows you,
              or&nbsp;anyone else who knows the seed, to&nbsp;re-generate and control this
              account.
            </Tooltip>
            <Icon
              ref={seedTooltip}
              name="question"
              size={20}
              color="var(--color-primary-500)"
            />
          </LabelText>
          <InputText value={shortSeed} disabled={true} />
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Keypair type
            <Tooltip align={tooltipAlign} targetRef={keypairTooltip}>
              Substrate supports a&nbsp;number of&nbsp;different crypto mechanisms.
              As&nbsp;such the keyring allows for the creation and management
              of&nbsp;different types of&nbsp;crypto.
            </Tooltip>
            <Icon
              ref={keypairTooltip}
              name="question"
              size={20}
              color="var(--color-primary-500)"
            />
          </LabelText>
          <InputText value={defaultPairType} disabled={true} />
        </ContentRow>
        <ContentRow>
          {/* TODO: rewrite to component props [UI-108] */}
          <LabelText size="m">
            Derivation path
            <Tooltip align={tooltipAlign} targetRef={pathTooltip}>
              If&nbsp;you would like to&nbsp;create and manage several accounts
              on&nbsp;the network using the same seed, you can use derivation paths.
            </Tooltip>
            <Icon
              ref={pathTooltip}
              name="question"
              size={20}
              color="var(--color-primary-500)"
            />
          </LabelText>
          <InputText value={derivePath || 'None provided'} disabled={true} />
        </ContentRow>
        <ContentRow>
          <TextWarning color="additional-warning-500" size="s">
            Consider storing your account in&nbsp;a&nbsp;signer such
            as&nbsp;a&nbsp;browser extension, hardware device, QR-capable phone wallet
            (non-connected) or&nbsp;desktop application for optimal account security.
            Future versions of&nbsp;the web-only interface will drop support for
            non-external accounts, much like the IPFS version.
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
