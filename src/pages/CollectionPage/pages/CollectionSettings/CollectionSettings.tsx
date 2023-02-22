import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Heading,
  Icon,
  InputText,
  Loader,
  Text,
  useNotifications,
} from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { PagePaper, StatusTransactionModal, TooltipWrapper } from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { BurnCollectionModal } from '@app/pages/CollectionNft/components/BurnCollectionModal';
import { useAccounts, useApi } from '@app/hooks';
import {
  ButtonGroup,
  Form,
  FormBody,
  FormHeader,
  FormRow,
  FormWrapper,
  SettingsRow,
} from '@app/pages/components/FormComponents';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';
import { useCollectionBurn } from '@app/api';

const CollectionSettings = () => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collection, collectionLoading } = useCollectionContext() || {};
  const { selectedAccount } = useAccounts();
  const { currentChain } = useApi();
  const {
    feeFormatted,
    getFee,
    feeError,
    feeLoading,
    submitWaitResult,
    submitWaitResultError,
    isLoadingSubmitResult,
  } = useCollectionBurn();
  const navigate = useNavigate();
  const { error } = useNotifications();

  useEffect(() => {
    logUserEvent(UserEvents.SETTINGS_OF_COLLECTION);
  }, []);

  useEffect(() => {
    if (feeError) {
      error(feeError);
    }
    if (submitWaitResultError) {
      error(submitWaitResultError);
    }
  }, [feeError, submitWaitResultError]);

  const {
    token_limit,
    owner_can_destroy,
    sponsorship = null,
    collection_id,
  } = collection || {};
  const ownerCanDestroy = Boolean(owner_can_destroy) !== false;

  useEffect(() => {
    if (!isVisibleConfirmModal || !collection_id || !selectedAccount?.address) {
      return;
    }
    getFee({
      collectionId: collection_id,
      address: selectedAccount?.address,
    });
  }, [collection_id, getFee, isVisibleConfirmModal, selectedAccount?.address]);

  const handleBurnCollection = async () => {
    if (!collection_id || !selectedAccount) {
      return;
    }

    setVisibleConfirmModal(false);

    try {
      await submitWaitResult({
        payload: {
          collectionId: collection_id,
          address: selectedAccount.address,
        },
      });
      navigate(`/${currentChain.network}/my-collections`);
    } catch (e: any) {
      error(e.message);
    }
  };

  const handleTokenLimit = (value: string) => {
    // if (!value) {
    //   form.setFieldValue('limit', '');
    //   return;
    // }
    // const numVal = Number(value);
    // if (numVal > maxTokenLimit || numVal < 0) {
    //   return;
    // }
    // form.setFieldValue('limit', numVal);
  };

  return (
    <PagePaper>
      <FormWrapper>
        {collectionLoading ? (
          <Loader />
        ) : (
          <>
            <FormHeader>
              <Heading size="3">Advanced settings</Heading>
              <Text>
                These settings are intended for users who want to place their collection
                on the marketplace.
              </Text>
            </FormHeader>
            <FormBody>
              <Form>
                <SettingsRow>
                  <InputText
                    label={
                      <>
                        Collection sponsor address
                        <TooltipWrapper
                          align={DEFAULT_POSITION_TOOLTIP}
                          message={
                            <>
                              The collection sponsor pays for all transactions related
                              to&nbsp;this collection. You can set as&nbsp;a&nbsp;sponsor
                              a&nbsp;regular account or&nbsp;a&nbsp;market contract. The
                              sponsor will need to&nbsp;confirm the sponsorship before the
                              sponsoring begins
                            </>
                          }
                        >
                          <Icon
                            name="question"
                            size={22}
                            color="var(--color-primary-500)"
                          />
                        </TooltipWrapper>
                      </>
                    }
                    additionalText="The designated sponsor should approve the request"
                    id="address"
                    maxLength={49}
                    value=""
                    onChange={(value) => {
                      // form.setFieldValue('address', value);
                    }}
                  />
                </SettingsRow>
                <FormRow>
                  <Heading size="4">One-time install options</Heading>
                  <Text>
                    Please note that once installed, these settings cannot be changed
                    later. If you do not change them now, you can change them once on the
                    Settings tab in the collection detail card.
                  </Text>
                </FormRow>
                <SettingsRow>
                  <InputText
                    label={
                      <>
                        Token limit
                        <TooltipWrapper
                          align={DEFAULT_POSITION_TOOLTIP}
                          message={
                            <>
                              The token limit (collection size) is&nbsp;a&nbsp;mandatory
                              parameter if&nbsp;you want to&nbsp;list your collection
                              on&nbsp;a&nbsp;marketplace.
                            </>
                          }
                        >
                          <Icon
                            name="question"
                            size={22}
                            color="var(--color-primary-500)"
                          />
                        </TooltipWrapper>
                      </>
                    }
                    additionalText="Unlimited by default"
                    id="limit"
                    value=""
                    role="number"
                    onChange={handleTokenLimit}
                  />
                </SettingsRow>
                <SettingsRow>
                  <Checkbox
                    checked={false}
                    label={
                      <>
                        Owner can burn collection
                        <TooltipWrapper
                          align={DEFAULT_POSITION_TOOLTIP}
                          message={
                            <>
                              Should you decide to&nbsp;keep the right to&nbsp;destroy the
                              collection, a&nbsp;marketplace could reject
                              it&nbsp;depending on&nbsp;its policies as&nbsp;it&nbsp;gives
                              the author the power to&nbsp;arbitrarily destroy
                              a&nbsp;collection at&nbsp;any moment in&nbsp;the future
                            </>
                          }
                        >
                          {' '}
                          <Icon
                            name="question"
                            size={22}
                            color="var(--color-primary-500)"
                          />
                        </TooltipWrapper>
                      </>
                    }
                    disabled={!ownerCanDestroy}
                    onChange={(value) => {
                      // form.setFieldValue('ownerCanDestroy', value);
                    }}
                  />
                </SettingsRow>
                <ButtonGroup align="space-between">
                  <TooltipWrapper message={<>The form in&nbsp;development progress</>}>
                    <Button title="Save changes" disabled={true} type="submit" />
                  </TooltipWrapper>
                  {ownerCanDestroy && (
                    <Button
                      title="Burn collection"
                      disabled={(collection?.tokens_count || 0) > 0}
                      iconLeft={{
                        size: 15,
                        name: 'burn',
                        color: 'var(--color-coral-500)',
                      }}
                      role="danger"
                      onClick={() => setVisibleConfirmModal(true)}
                    />
                  )}
                </ButtonGroup>
              </Form>
            </FormBody>
          </>
        )}
      </FormWrapper>
      <StatusTransactionModal
        isVisible={isLoadingSubmitResult}
        description="Burning collection"
      />

      <BurnCollectionModal
        isVisible={isVisibleConfirmModal}
        isLoading={feeLoading}
        fee={feeFormatted}
        onConfirm={handleBurnCollection}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </PagePaper>
  );
};

/* TODO: WAL-343
const SettingsButtonGroup = styled(ButtonGroup)`
  .unique-button.ghost {
    padding: 0;
    color: var(--color-coral-500);
  }
`; */

export default CollectionSettings;
