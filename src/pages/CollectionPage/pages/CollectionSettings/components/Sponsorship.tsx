import { useEffect, useMemo, useState } from 'react';
import { Address } from '@unique-nft/utils';

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
import { useCollectionSetSponsor } from '@app/api';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';

import { ConfirmSponsorship } from './ConfirmSponsorship';
import { SettingsSavingProps } from './types';
import { RemoveSponsorship } from './RemoveSponsorship';

export const Sponsorship = ({ onComplete }: SettingsSavingProps) => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collectionSettings } = useCollectionContext() || {};
  const { selectedAccount } = useAccounts();
  const {
    feeFormatted,
    getFee,
    feeError,
    feeLoading,
    submitWaitResult,
    isLoadingSubmitResult,
  } = useCollectionSetSponsor();
  const { error, info } = useNotifications();

  const { sponsorship, id: collectionId } = collectionSettings || {};

  const [sponsor, setSponsor] = useState<string | undefined>(sponsorship?.address);

  const isValid = useMemo(() => {
    return !sponsor || Address.is.substrateAddressInAnyForm(sponsor);
  }, [sponsor]);

  const isChanged = useMemo(() => {
    return sponsor !== sponsorship?.address;
  }, [sponsor, sponsorship]);

  const canConfirmSponsorship = useMemo(() => {
    return (
      !sponsorship?.isConfirmed &&
      selectedAccount?.address.toLowerCase() === sponsorship?.address.toLowerCase()
    );
  }, [sponsorship, selectedAccount?.address]);

  useEffect(() => {
    setSponsor(sponsorship?.address);
  }, [sponsorship]);

  useEffect(() => {
    if (feeError) {
      error(feeError);
    }
  }, [feeError]);

  useEffect(() => {
    if (
      !isChanged ||
      !collectionId ||
      !selectedAccount?.address ||
      !isValid ||
      !sponsor
    ) {
      return;
    }
    getFee({
      collectionId,
      address: selectedAccount?.address,
      newSponsor: sponsor || '',
    });
  }, [collectionId, sponsor, getFee, selectedAccount?.address]);

  const handleBurnCollection = async () => {
    if (!collectionId || !selectedAccount || !isValid || !sponsor) {
      return;
    }

    setVisibleConfirmModal(false);

    try {
      await submitWaitResult(
        {
          payload: {
            collectionId,
            address: selectedAccount.address,
            newSponsor: sponsor || '',
          },
        },
        { onSuccess: onComplete },
      );
      info('The collection sponsor set successfully');
    } catch (e: any) {
      error(e.message);
    }
  };

  return (
    <>
      <FormBody>
        <Form>
          <FormRow>
            <Heading size="4">Collection sponsor</Heading>
            <Typography appearance="block">
              An&nbsp;address from which all transaction fees related
              to&nbsp;the&nbsp;collection are paid from (i.e.&nbsp;a&nbsp;sponsoring fund
              address).
            </Typography>
            <Typography appearance="block">
              This can be&nbsp;a&nbsp;regular account or&nbsp;a&nbsp;market contract
              address.
            </Typography>
          </FormRow>
          <SettingsRow>
            <InputText
              clearable
              id="address"
              label="Address"
              value={sponsor}
              error={!isValid}
              statusText={!isValid ? 'Sponsor address is not correct' : ''}
              onChange={setSponsor}
              onClear={() => setSponsor(undefined)}
            />
          </SettingsRow>
          <SettingsRow>
            {isValid && isChanged && sponsor ? (
              <FeeInformationTransaction fee={feeFormatted} feeLoading={feeLoading} />
            ) : (
              <Alert type="warning">
                A fee will be&nbsp;calculated after changing the&nbsp;sponsor address
              </Alert>
            )}
          </SettingsRow>
          <ButtonGroup $fill align="flex-start">
            <TooltipWrapper
              message={
                !isValid
                  ? 'Sponsor address is not correct'
                  : !isChanged
                  ? 'Nothing changed'
                  : !sponsor
                  ? 'Sponsor address cannot be empty'
                  : ''
              }
            >
              <Button
                title="Save changes"
                disabled={!isValid || !isChanged || !sponsor}
                onClick={() => setVisibleConfirmModal(true)}
              />
            </TooltipWrapper>
            {sponsorship?.address && (
              <RemoveSponsorship collectionId={collectionId} onComplete={onComplete} />
            )}
            {canConfirmSponsorship && (
              <ConfirmSponsorship collectionId={collectionId} onComplete={onComplete} />
            )}
          </ButtonGroup>
        </Form>
      </FormBody>

      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Updating collection sponsor"
      />

      <ConfirmUpdateCollectionModal
        title="Updating collection sponsor"
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleBurnCollection}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </>
  );
};
