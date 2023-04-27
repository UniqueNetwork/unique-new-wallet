import { useEffect, useMemo, useState } from 'react';

import {
  StatusTransactionModal,
  TooltipWrapper,
  Button,
  Heading,
  Typography,
  useNotifications,
  Alert,
  Toggle,
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
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { useCollectionSetPermissions } from '@app/api/restApi/collection/useCollectionSetPermissions';

import { SettingsSavingProps } from './types';

export const NestingPermissions = ({ onComplete }: SettingsSavingProps) => {
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
  } = useCollectionSetPermissions();
  const { error, info } = useNotifications();

  const { permissions = {}, id: collectionId } = collectionSettings || {};
  const { nesting } = permissions;

  const initialTokenOwnerCanNest =
    nesting?.tokenOwner === undefined ? true : nesting?.tokenOwner;
  const initialCollectionAdminCanNest =
    nesting?.collectionAdmin === undefined ? true : nesting?.collectionAdmin;

  const [ownerCanNest, setOwnerCanNest] = useState<boolean>(initialTokenOwnerCanNest);
  const [collectionAdminCanNest, setCollectionAdminCanNest] = useState<boolean>(
    initialCollectionAdminCanNest,
  );

  const isChanged = useMemo(() => {
    return (
      initialTokenOwnerCanNest !== ownerCanNest ||
      initialCollectionAdminCanNest !== collectionAdminCanNest
    );
  }, [
    ownerCanNest,
    collectionAdminCanNest,
    initialTokenOwnerCanNest,
    initialCollectionAdminCanNest,
  ]);

  useEffect(() => {
    if (feeError) {
      error(feeError);
    }
    if (submitWaitResultError) {
      error(submitWaitResultError);
    }
  }, [feeError, submitWaitResultError]);

  useEffect(() => {
    if (!collectionId || !selectedAccount?.address) {
      return;
    }
    getFee({
      collectionId,
      address: selectedAccount?.address,
      permissions: {
        nesting: {
          tokenOwner: ownerCanNest,
          collectionAdmin: collectionAdminCanNest,
        },
      },
    });
  }, [
    collectionId,
    ownerCanNest,
    collectionAdminCanNest,
    getFee,
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
            permissions: {
              nesting: {
                tokenOwner: ownerCanNest,
                collectionAdmin: collectionAdminCanNest,
              },
            },
          },
        },
        {
          onSuccess: onComplete,
        },
      );
      info('The collection permissions set successfully');
    } catch (e: any) {
      error(e.message);
    }
  };

  return (
    <>
      <FormBody>
        <Form>
          <FormRow>
            <Heading size="4">Nesting</Heading>
            <Typography appearance="block">
              Enables bundle creation in&nbsp;the&nbsp;collection. Can be&nbsp;changed
              at&nbsp;any time.
            </Typography>
            <Typography appearance="block">
              Disabling the&nbsp;nesting in&nbsp;the&nbsp;collection does not affect
              the&nbsp;structure of&nbsp;the existing bundle. Bundle owners will still
              be&nbsp;able to&nbsp;access the&nbsp;nested tokens. However, nesting
              of&nbsp;new ones will not be&nbsp;possible.
            </Typography>
          </FormRow>
          <SettingsRow>
            <Toggle on={ownerCanNest} label="Owner can nest" onChange={setOwnerCanNest} />
          </SettingsRow>
          <SettingsRow>
            <Toggle
              on={collectionAdminCanNest}
              label="Collection admin can nest"
              onChange={setCollectionAdminCanNest}
            />
          </SettingsRow>
          <SettingsRow>
            {isChanged ? (
              <FeeInformationTransaction fee={feeFormatted} feeLoading={feeLoading} />
            ) : (
              <Alert type="warning">
                A fee will be&nbsp;calculated after changing nesting permissions
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
          </ButtonGroup>
        </Form>
      </FormBody>

      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Updating collection nesting permissions"
      />

      <ConfirmUpdateCollectionModal
        title="Updating collection nesting permissions"
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleSubmit}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </>
  );
};
