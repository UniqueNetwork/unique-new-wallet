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
} from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { ConfirmUpdateCollectionModal } from '@app/pages/CollectionPage/pages/CollectionSettings/components/ConfirmUpdateCollectionModal';
import { useAccounts } from '@app/hooks';
import {
  ButtonGroup,
  Form,
  FormBody,
  FormRow,
  SettingsRow,
} from '@app/pages/components/FormComponents';
import { maxTokenLimit } from '@app/pages';
import { useCollectionSetLimits } from '@app/api';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

import { SettingsSavingProps } from './types';

export const Limits = ({ onComplete }: SettingsSavingProps) => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collectionSettings } = useCollectionContext() || {};
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

  const [tokenLimit, setTokenLimit] = useState<string | undefined>(
    limits?.tokenLimit?.toString() || maxTokenLimit.toString(),
  );

  const isChanged = useMemo(() => {
    return Number(tokenLimit) !== (limits?.tokenLimit || maxTokenLimit);
  }, [tokenLimit, limits]);

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
      },
    });
  }, [collectionId, tokenLimit, getFee, isValid, isChanged, selectedAccount?.address]);

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
      <FormBody>
        <Form>
          <FormRow>
            <Heading size="4">Token limit</Heading>
            <Typography appearance="block">
              Collection size&nbsp;—&nbsp;mandatory for listing a&nbsp;collection
              on&nbsp;a&nbsp;marketplace.
            </Typography>
            <Typography appearance="block">
              Unlimited by&nbsp;default. This value can be&nbsp;changed many times over
              but with the&nbsp;following caveats: each successive value must
              be&nbsp;smaller than the&nbsp;previous one and it&nbsp;can never
              be&nbsp;reset back to&nbsp;&lsquo;unlimited&lsquo;.
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
                !isValid
                  ? 'Incorrect token limit value'
                  : !isChanged
                  ? 'Nothing changed'
                  : ''
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
          </ButtonGroup>
        </Form>
      </FormBody>

      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Updating limits"
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
