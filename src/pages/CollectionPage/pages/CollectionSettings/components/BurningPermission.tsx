import { useEffect, useMemo, useState } from 'react';

import {
  StatusTransactionModal,
  TooltipWrapper,
  Button,
  Heading,
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
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';
import { useCollectionSetLimits } from '@app/api';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

import { CollectionBurn } from './CollectionBurn';
import { SettingsSavingProps } from './types';

export const BurningPermission = ({ onComplete }: SettingsSavingProps) => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collectionSettings, collection } = useCollectionContext() || {};
  const { selectedAccount } = useAccounts();
  const {
    feeFormatted,
    getFee,
    feeError,
    feeLoading,
    submitWaitResult,
    isLoadingSubmitResult,
  } = useCollectionSetLimits();
  const { error, info } = useNotifications();

  const { limits, id: collectionId } = collectionSettings || {};

  const initialOwnerCanDestroy =
    limits?.ownerCanDestroy === undefined || limits?.ownerCanDestroy === null
      ? true
      : limits?.ownerCanDestroy;

  const [ownerCanDestroy, setOwnerCanDestroy] = useState<boolean>(initialOwnerCanDestroy);

  const isChanged = useMemo(() => {
    return ownerCanDestroy !== initialOwnerCanDestroy;
  }, [limits, initialOwnerCanDestroy, ownerCanDestroy]);

  useEffect(() => {
    if (feeError) {
      error(feeError);
    }
  }, [feeError]);

  useEffect(() => {
    if (!isChanged || !collectionId || !selectedAccount?.address) {
      return;
    }
    getFee({
      collectionId,
      address: selectedAccount?.address,
      limits: {
        ownerCanDestroy,
      },
    });
  }, [collectionId, ownerCanDestroy, getFee, isChanged, selectedAccount?.address]);

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
        <Heading size="4">Burn collection</Heading>
        <Alert type="warning">
          Collection burning permission can only be&nbsp;toggled once
        </Alert>
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
            limits?.ownerCanDestroy !== undefined && limits?.ownerCanDestroy !== null
          }
          onChange={setOwnerCanDestroy}
        />
      </SettingsRow>

      <SettingsRow>
        {isChanged ? (
          <FeeInformationTransaction fee={feeFormatted} feeLoading={feeLoading} />
        ) : (
          <Alert type="warning">
            A fee will be calculated after changing the&nbsp;burning permission
          </Alert>
        )}
      </SettingsRow>
      <ButtonGroup $fill align="space-between">
        <TooltipWrapper message={!isChanged ? 'Nothing changed' : ''}>
          <Button
            title="Save changes"
            disabled={!isChanged}
            onClick={() => {
              setVisibleConfirmModal(true);
            }}
          />
        </TooltipWrapper>
        {initialOwnerCanDestroy && (
          <TooltipWrapper
            message={
              collection?.tokens_count && collection?.tokens_count !== 0
                ? `The collection has ${collection?.tokens_count} ${
                    collection.tokens_count > 1 ? 'tokens' : 'token'
                  } and cannot be burned`
                : ''
            }
          >
            <CollectionBurn
              collectionId={collectionId}
              canBurn={collection?.tokens_count === 0}
            />
          </TooltipWrapper>
        )}
      </ButtonGroup>

      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Updating burning permission"
      />

      <ConfirmUpdateCollectionModal
        title="Updating burning permission"
        warning="You will not be able to undo this action."
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleSubmit}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </>
  );
};
