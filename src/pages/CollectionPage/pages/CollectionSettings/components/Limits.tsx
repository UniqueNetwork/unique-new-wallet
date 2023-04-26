import { useEffect, useMemo, useState } from 'react';

import {
  StatusTransactionModal,
  TooltipWrapper,
  Button,
  Heading,
  InputText,
  Typography,
  useNotifications,
  Alert,
  Icon,
  Toggle,
} from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { ConfirmUpdateCollectionModal } from '@app/pages/CollectionPage/pages/CollectionSettings/components/ConfirmUpdateCollectionModal';
import { useAccounts } from '@app/hooks';
import { ButtonGroup, FormRow, SettingsRow } from '@app/pages/components/FormComponents';
import { DEFAULT_POSITION_TOOLTIP, maxTokenLimit } from '@app/pages';
import { useCollectionSetLimits } from '@app/api';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

import { CollectionBurn } from './CollectionBurn';
import { SettingsSavingProps } from './types';

export const Limits = ({ onComplete }: SettingsSavingProps) => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collectionSettings, collection } = useCollectionContext() || {};
  const { selectedAccount } = useAccounts();
  const {
    feeFormatted,
    getFee,
    feeError,
    feeLoading,
    submitWaitResult,
    submitWaitResultError,
    isLoadingSubmitResult,
  } = useCollectionSetLimits();
  const { error, info } = useNotifications();

  const { limits, id: collectionId } = collectionSettings || {};

  const initialOwnerCanDestroy =
    limits?.ownerCanDestroy === undefined || limits?.ownerCanDestroy === null
      ? true
      : limits?.ownerCanDestroy;

  const [tokenLimit, setTokenLimit] = useState<string | undefined>(
    limits?.tokenLimit?.toString(),
  );
  const [ownerCanDestroy, setOwnerCanDestroy] = useState<boolean>(initialOwnerCanDestroy);

  const isChanged = useMemo(() => {
    return (
      Number(tokenLimit || '0') !== (limits?.tokenLimit || 0) ||
      ownerCanDestroy !== initialOwnerCanDestroy
    );
  }, [tokenLimit, limits, initialOwnerCanDestroy, ownerCanDestroy]);

  const isValid = useMemo(() => {
    if (!tokenLimit && !limits?.tokenLimit) {
      return true;
    }
    return limits?.tokenLimit
      ? Number(tokenLimit) <= limits.tokenLimit
      : Number(tokenLimit) <= maxTokenLimit;
  }, [tokenLimit, limits?.tokenLimit]);

  useEffect(() => {
    if (feeError) {
      error(feeError);
    }
    if (submitWaitResultError) {
      error(submitWaitResultError);
    }
  }, [feeError, submitWaitResultError]);

  useEffect(() => {
    if (!isValid || !isChanged || !collectionId || !selectedAccount?.address) {
      return;
    }
    getFee({
      collectionId,
      address: selectedAccount?.address,
      limits: {
        tokenLimit: Number(tokenLimit),
        ownerCanDestroy,
      },
    });
  }, [
    collectionId,
    tokenLimit,
    ownerCanDestroy,
    getFee,
    isValid,
    isChanged,
    selectedAccount?.address,
  ]);

  const handleSubmit = async () => {
    if (!collectionId || !selectedAccount) {
      return;
    }

    setVisibleConfirmModal(false);

    try {
      await submitWaitResult(
        {
          payload: {
            collectionId,
            address: selectedAccount.address,
            limits: {
              tokenLimit: Number(tokenLimit),
              ownerCanDestroy,
            },
          },
        },
        {
          onSuccess: onComplete,
        },
      );
      info('Limits set successfully');
    } catch (e: any) {
      error(e.message);
    }
  };

  return (
    <>
      <FormRow>
        <Heading size="4">Token limit</Heading>
        <Alert type="warning">Token limit can be set only once</Alert>
        <Typography appearance="block">
          Collection size&nbsp;—&nbsp;mandatory for listing a&nbsp;collection
          on&nbsp;a&nbsp;marketplace.
        </Typography>
        <Typography appearance="block">
          Unlimited by&nbsp;default. This value can be&nbsp;changed many times over but
          with the&nbsp;following caveats: each successive value must be&nbsp;smaller than
          the&nbsp;previous one and it&nbsp;can never be&nbsp;reset back
          to&nbsp;&lsquo;unlimited&lsquo;.
        </Typography>
      </FormRow>
      <SettingsRow>
        <InputText
          label="Numbers of tokens"
          id="limit"
          role="number"
          value={tokenLimit}
          error={!isValid}
          statusText={
            !isValid
              ? `The number of tokens must between 0 and ${
                  limits?.tokenLimit || maxTokenLimit
                }`
              : ''
          }
          onChange={(value) => {
            const parsed = Number(value);
            if (!parsed) {
              !value && setTokenLimit(value);
            } else {
              setTokenLimit(parsed > maxTokenLimit ? tokenLimit : parsed.toString());
            }
          }}
        />
      </SettingsRow>
      <FormRow>
        <Heading size="4">Burn collection</Heading>
        <Alert type="warning">
          Collection burning permission can only be&nbsp;toggled once
        </Alert>
        <Typography appearance="block">
          Although this is&nbsp;an&nbsp;immutable setting, when enabling it&nbsp;during
          the&nbsp;initial collection creation an&nbsp;additional one-time opportunity
          is&nbsp;provided in&nbsp;which it&nbsp;can be&nbsp;reverted
          in&nbsp;the&nbsp;settings panel. On&nbsp;the&nbsp;other hand, accepting
          the&nbsp;default value will render it&nbsp;permanent.
        </Typography>
      </FormRow>
      <SettingsRow>
        <Toggle
          on={ownerCanDestroy}
          label={
            <>
              Owner can burn collection
              <TooltipWrapper
                align={DEFAULT_POSITION_TOOLTIP}
                message={
                  <>
                    Should you decide to&nbsp;keep the right to&nbsp;destroy
                    the&nbsp;collection, a&nbsp;marketplace could reject it&nbsp;depending
                    on&nbsp;its policies as&nbsp;it&nbsp;gives the author the&nbsp;power
                    to&nbsp;arbitrarily destroy a&nbsp;collection at&nbsp;any moment
                    in&nbsp;the&nbsp;future
                  </>
                }
              >
                {' '}
                <Icon name="question" size={22} color="var(--color-primary-500)" />
              </TooltipWrapper>
            </>
          }
          disabled={
            limits?.ownerCanDestroy !== undefined || limits?.ownerCanDestroy !== null
          }
          onChange={setOwnerCanDestroy}
        />
      </SettingsRow>

      <SettingsRow>
        {isValid && isChanged ? (
          <FeeInformationTransaction fee={feeFormatted} feeLoading={feeLoading} />
        ) : (
          <Alert type="warning">
            A fee will be calculated after changing the&nbsp;sponsor address
          </Alert>
        )}
      </SettingsRow>
      <ButtonGroup $fill align="space-between">
        <TooltipWrapper
          message={
            !isValid ? 'Incorrect token limit value' : !isChanged ? 'Nothing changed' : ''
          }
        >
          <Button
            title="Save changes"
            disabled={!isChanged || !isValid}
            onClick={() => {
              setVisibleConfirmModal(true);
            }}
          />
        </TooltipWrapper>
        {initialOwnerCanDestroy && (
          <CollectionBurn
            collectionId={collectionId}
            canBurn={collection?.tokens_count === 0}
          />
        )}
      </ButtonGroup>

      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Update limits"
      />

      <ConfirmUpdateCollectionModal
        title="Updating limits"
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleSubmit}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </>
  );
};
