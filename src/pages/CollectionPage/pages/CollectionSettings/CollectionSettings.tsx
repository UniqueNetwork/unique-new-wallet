import { Button, Heading, Icon, Loader, Text } from '@unique-nft/ui-kit';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useCollectionLimits,
  useCollectionPermissions,
  useCollectionSponsorship,
} from '@app/api/restApi/collection/useCollectionSetting';
import { PagePaper, StatusTransactionModal, TooltipWrapper } from '@app/components';
import {
  CheckboxController,
  InputController,
  ToggleController,
} from '@app/components/FormControllerComponents';
import { useAccounts } from '@app/hooks';
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';
import { BurnCollectionModal } from '@app/pages/CollectionNft/components/BurnCollectionModal';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import {
  ButtonGroup,
  FormRow,
  FormWrapper,
  SettingsRow,
  SettingText,
} from '@app/pages/components/FormComponents';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

const CollectionSettings = () => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collection, collectionLoading } = useCollectionContext() || {};
  const { submitWaitResult: submitWaitResultSponsorship } = useCollectionSponsorship();
  const { submitWaitResult: submitWaitResultLimits } = useCollectionLimits();
  const { submitWaitResult: submitWaitPermissions } = useCollectionPermissions();
  const { selectedAccount } = useAccounts();
  const [isLoadingBurnCollection, setLoadingBurnCollection] = useState(false);
  const [isLoadingSponsorship, setLoadingSponsorship] = useState(false);
  const [isLoadingLimits, setLoadingLimits] = useState(false);
  const [isLoadingPermissions, setLoadingPermissions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    logUserEvent(UserEvents.SETTINGS_OF_COLLECTION);
  }, []);

  const {
    token_limit,
    owner_can_destroy,
    sponsorship = null,
    collection_id,
  } = collection || {};
  const ownerCanDestroy = Boolean(owner_can_destroy) !== false;

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      nesting: false,
      sponsorAddress: '',
      tokenLimit: 0,
      destroy: false,
    },
  });

  useEffect(() => {
    if (collection) {
      form.setValue('nesting', collection.nesting_enabled);
      form.setValue('sponsorAddress', collection.sponsorship);
      form.setValue('tokenLimit', collection.token_limit);
      form.setValue('destroy', collection.owner_can_destroy);
    }
  }, [collection]);

  const submitHandler = () => {
    const { destroy, nesting, sponsorAddress, tokenLimit } = form.getValues();
    if (
      destroy !== collection?.owner_can_destroy ||
      tokenLimit !== collection?.token_limit
    ) {
      setLoadingLimits(true);
      submitWaitResultLimits({
        payload: {
          address: selectedAccount!.address,
          collectionId: Number(collection_id),
          limits: {
            tokenLimit,
            ownerCanDestroy: destroy,
          },
        },
      })
        .then(() => {
          setLoadingLimits(false);
        })
        .catch((e) => {
          console.error(e);
          setLoadingLimits(false);
        });
    }
    if (nesting !== collection?.nesting_enabled) {
      setLoadingPermissions(true);
      submitWaitPermissions({
        payload: {
          address: selectedAccount!.address,
          collectionId: Number(collection_id),
          permissions: {
            nesting: {
              tokenOwner: nesting,
            },
          },
        },
      })
        .then(() => {
          setLoadingPermissions(false);
        })
        .catch((e) => {
          console.error(e);
          setLoadingLimits(false);
        });
    }
    if (sponsorAddress !== collection?.sponsorship) {
      setLoadingSponsorship(true);
      submitWaitResultSponsorship({
        payload: {
          address: selectedAccount!.address,
          collectionId: Number(collection_id),
          newSponsor: sponsorAddress,
        },
      })
        .then(() => {
          setLoadingSponsorship(false);
        })
        .catch((e) => {
          console.error(e);
          setLoadingLimits(false);
        });
    }
  };

  const handleBurnCollection = () => {
    if (!collection_id || !selectedAccount) {
      return;
    }

    setVisibleConfirmModal(false);
    setLoadingBurnCollection(true);

    try {
      /* const { data } = await deleteCollection(api!, {
        collectionId: collection_id,
        address: selectedAccount.address,
      });

      const signature = await signMessage(data.signerPayloadJSON, selectedAccount);

      await extrinsicSubmit(api!, {
        signerPayloadJSON: { ...data.signerPayloadJSON },
        signature,
      }); */
      navigate('/my-collections');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBurnCollection(false);
    }
  };

  return (
    <PagePaper>
      <FormWrapper>
        {collectionLoading ? (
          <Loader />
        ) : (
          <>
            <FormProvider {...form}>
              <Heading size="3" className="setting-title">
                Advanced settings
              </Heading>
              <Heading size="4">Nesting</Heading>
              <SettingText>
                Enables bundle creation in the collection. Can be changed at any time.
              </SettingText>
              <SettingText>
                Disabling the nesting in the collection does not affect the structure of
                the existing bundle. Bundle owners will still be able to access the nested
                tokens. However, nesting of new ones will not be possible.
              </SettingText>
              <SettingsRow>
                <ToggleController label="Nesting enabled" name="nesting" size="m" />
              </SettingsRow>
              <Heading className="setting-title" size="3">
                Marketplace related settings
              </Heading>
              <SettingsRow>
                <InputController
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
                  name="sponsorAddress"
                />
              </SettingsRow>
              <FormRow>
                <Heading size="4">One-time install options</Heading>
                <Text>
                  Please note that once installed, these settings cannot be changed later.
                  If you do not change them now, you can change them once on the Settings
                  tab in the collection detail card.
                </Text>
              </FormRow>
              <SettingsRow>
                <InputController
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
                  role="number"
                  name="tokenLimit"
                />
              </SettingsRow>
              <SettingsRow>
                <CheckboxController
                  label={
                    <>
                      Owner can burn collection
                      <TooltipWrapper
                        align={DEFAULT_POSITION_TOOLTIP}
                        message={
                          <>
                            Should you decide to&nbsp;keep the right to&nbsp;destroy the
                            collection, a&nbsp;marketplace could reject it&nbsp;depending
                            on&nbsp;its policies as&nbsp;it&nbsp;gives the author the
                            power to&nbsp;arbitrarily destroy a&nbsp;collection
                            at&nbsp;any moment in&nbsp;the future
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
                  name="destroy"
                  disabled={!ownerCanDestroy}
                />
              </SettingsRow>
              <ButtonGroup>
                <TooltipWrapper message={<>The form in&nbsp;development progress</>}>
                  <Button title="Save changes" onClick={submitHandler} />
                </TooltipWrapper>
                {/* TODO: WAL-343
                  {ownerCanDestroy && (
                    <Button
                      title="Burn collection"
                      iconLeft={{ size: 15, name: 'burn', color: 'var(--color-coral-500)' }}
                      role="ghost"
                      onClick={() => setVisibleConfirmModal(true)}
                    />
                  )} */}
              </ButtonGroup>
            </FormProvider>
          </>
        )}
      </FormWrapper>
      <StatusTransactionModal
        isVisible={isLoadingBurnCollection}
        description="Burning collection"
      />
      <StatusTransactionModal
        isVisible={isLoadingSponsorship}
        description="Set sponsorship"
      />
      <StatusTransactionModal isVisible={isLoadingLimits} description="Set limits" />
      <StatusTransactionModal
        isVisible={isLoadingPermissions}
        description="Set permissions"
      />

      <BurnCollectionModal
        isVisible={isVisibleConfirmModal}
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
