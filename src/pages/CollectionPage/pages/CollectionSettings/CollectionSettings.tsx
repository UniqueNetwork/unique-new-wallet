import { Button, Heading, Icon, Loader, useNotifications } from '@unique-nft/ui-kit';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCollectionLimits } from '@app/api/restApi/collection/useCollectionLimits';
import { useCollectionPermissions } from '@app/api/restApi/collection/useCollectionPermissions';
import { useCollectionSponsorship } from '@app/api/restApi/collection/useCollectionSponsorship';
import { PagePaper, TooltipWrapper } from '@app/components';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import {
  CheckboxController,
  InputController,
  ToggleController,
} from '@app/components/FormControllerComponents';
import { useAccounts } from '@app/hooks';
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';
import {
  SettingsCollectionModal,
  Step,
} from '@app/pages/CollectionNft/components/SettingsCollectionModal';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import {
  ButtonGroup,
  FormWrapper,
  SettingsRow,
  SettingText,
} from '@app/pages/components/FormComponents';
import { truncateDecimalsBalanceSheet } from '@app/utils';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

const CollectionSettings = () => {
  const { error } = useNotifications();
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [totalFee, setTotalFee] = useState({
    sponsorshipFee: 0,
    limitFee: 0,
    permissionsFee: 0,
    sum: 0,
  });
  const { collection, collectionLoading } = useCollectionContext() || {};
  const {
    getFee: getFeeSponsorship,
    submitWaitResult: submitWaitResultSponsorship,
    submitWaitResultError: submitWaitResultErrorSponsorship,
  } = useCollectionSponsorship();
  const {
    getFee: getFeeLimits,
    submitWaitResult: submitWaitResultLimits,
    submitWaitResultError: submitWaitResultErrorLimits,
  } = useCollectionLimits();
  const {
    getFee: getFeePermissions,
    submitWaitResult: submitWaitPermissions,
    submitWaitResultError: submitWaitResultErrorPermissions,
  } = useCollectionPermissions();
  const { selectedAccount } = useAccounts();
  const [isLoadingBurnCollection, setLoadingBurnCollection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    logUserEvent(UserEvents.SETTINGS_OF_COLLECTION);
  }, []);

  useEffect(() => {
    setTotalFee({
      ...totalFee,
      sum: 0 + totalFee.limitFee + totalFee.permissionsFee + totalFee.sponsorshipFee,
    });
  }, [totalFee.limitFee, totalFee.permissionsFee, totalFee.sponsorshipFee]);

  const {
    token_limit,
    owner_can_destroy,
    sponsorship = null,
    nesting_enabled,
    collection_id,
  } = collection || {};
  const ownerCanDestroy = Boolean(owner_can_destroy) !== false;
  const methods = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      nesting: nesting_enabled,
      newSponsor: sponsorship || '',
      tokenLimit: token_limit,
      ownerCanDestroy,
    },
  });
  const {
    getValues,
    setValue,
    formState: { dirtyFields },
  } = methods;

  useEffect(() => {
    if (collection) {
      setValue('nesting', collection.nesting_enabled);
      setValue('newSponsor', collection.sponsorship);
      setValue('tokenLimit', collection.token_limit);
      setValue('ownerCanDestroy', collection.owner_can_destroy);
    }
  }, [collection]);

  useEffect(() => {
    if (dirtyFields.nesting) {
      getFeePermissions({
        address: selectedAccount!.address,
        collectionId: Number(collection_id),
        permissions: {
          nesting: {
            tokenOwner: getValues('nesting'),
          },
        },
      }).then((value) => {
        setTotalFee({
          ...totalFee,
          permissionsFee: parseFloat(value.amount),
        });
      });
    }
  }, [dirtyFields.nesting]);

  useEffect(() => {
    if (dirtyFields.newSponsor) {
      getFeeSponsorship({
        address: selectedAccount!.address,
        collectionId: Number(collection_id),
        newSponsor: getValues('newSponsor'),
      }).then((value) => {
        setTotalFee({
          ...totalFee,
          sponsorshipFee: parseFloat(value.amount),
        });
      });
    }
  }, [dirtyFields.newSponsor]);

  useEffect(() => {
    const { ownerCanDestroy, tokenLimit } = dirtyFields;
    if (ownerCanDestroy || tokenLimit) {
      getFeeLimits({
        address: selectedAccount!.address,
        collectionId: Number(collection_id),
        limits: {
          tokenLimit: getValues('tokenLimit'),
          ownerCanDestroy: getValues('ownerCanDestroy'),
        },
      }).then((value) => {
        setTotalFee({
          ...totalFee,
          limitFee: parseFloat(value.amount),
        });
      });
    }
  }, [dirtyFields.ownerCanDestroy, dirtyFields.tokenLimit]);

  useEffect(() => {
    if (submitWaitResultErrorSponsorship) {
      error(submitWaitResultErrorSponsorship);
    }
    if (submitWaitResultErrorLimits) {
      error(submitWaitResultErrorLimits);
    }
    if (submitWaitResultErrorPermissions) {
      error(submitWaitResultErrorPermissions);
    }
  }, [
    submitWaitResultErrorSponsorship,
    submitWaitResultErrorLimits,
    submitWaitResultErrorPermissions,
  ]);

  const submitHandler = () => {
    const { ownerCanDestroy, nesting, newSponsor, tokenLimit } = dirtyFields;
    const stepArr: Step[] = [];
    setVisibleConfirmModal(true);
    if (ownerCanDestroy || tokenLimit) {
      stepArr.push({
        name: 'Setting up token limit',
        pending: true,
      });
      submitWaitResultLimits({
        payload: {
          address: selectedAccount!.address,
          collectionId: Number(collection_id),
          limits: {
            tokenLimit: getValues('tokenLimit'),
            ownerCanDestroy: getValues('ownerCanDestroy'),
          },
        },
      }).then(() => {
        const foundIndex = stepArr.findIndex(
          (step) => step.name === 'Setting up token limit',
        );
        stepArr[foundIndex].pending = false;
        setSteps(stepArr);
      });
    }
    if (nesting) {
      stepArr.push({
        name: 'Setting up collection permissions',
        pending: true,
      });
      submitWaitPermissions({
        payload: {
          address: selectedAccount!.address,
          collectionId: Number(collection_id),
          permissions: {
            nesting: {
              tokenOwner: getValues('nesting'),
            },
          },
        },
      }).then(() => {
        const foundIndex = stepArr.findIndex(
          (step) => step.name === 'Setting up collection permissions',
        );
        stepArr[foundIndex].pending = false;
        setSteps(stepArr);
      });
    }
    if (newSponsor) {
      stepArr.push({
        name: 'Setting up collection sponsor',
        pending: true,
      });
      submitWaitResultSponsorship({
        payload: {
          address: selectedAccount!.address,
          collectionId: Number(collection_id),
          newSponsor: getValues('newSponsor'),
        },
      }).then(() => {
        const foundIndex = stepArr.findIndex(
          (step) => step.name === 'Setting up collection sponsor',
        );
        stepArr[foundIndex].pending = false;
        setSteps(stepArr);
      });
    }
    setSteps(stepArr);
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
            <FormProvider {...methods}>
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
              <Heading size="4">Collection sponsor</Heading>
              <SettingText>
                An address from which all transaction fees related to the collection are
                paid from (i.e. a sponsoring fund address).
              </SettingText>
              <SettingText>
                This can be a regular account or a market contract address.
              </SettingText>
              <SettingsRow>
                <InputController
                  label="Address"
                  id="address"
                  maxLength={49}
                  name="newSponsor"
                />
              </SettingsRow>
              <Heading size="4">Token limit</Heading>
              <SettingText>
                Collection size — mandatory for listing a collection on a marketplace.
              </SettingText>
              <SettingText>
                Unlimited by default. This value can be changed many times over but with
                the following caveats: each successive value must be smaller than the
                previous one and it can never be reset back to &apos;unlimited&apos;.
              </SettingText>
              <SettingsRow>
                <InputController
                  label="Number of tokens"
                  id="limit"
                  role="number"
                  name="tokenLimit"
                />
              </SettingsRow>
              <Heading size="4">Burn collection</Heading>
              <SettingText>
                Although this is an immutable setting, when enabling it during the initial
                collection creation an additional one-time opportunity is provided in
                which it can be reverted in the settings panel. On the other hand,
                accepting the default value will render it permanent.
              </SettingText>
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
              {totalFee.sum > 0 && (
                <FeeInformationTransaction
                  fee={`${truncateDecimalsBalanceSheet(`${totalFee.sum}`)} ${
                    selectedAccount?.balance?.availableBalance.unit
                  }`}
                />
              )}
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
      <SettingsCollectionModal
        title="Please wait"
        steps={steps}
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
