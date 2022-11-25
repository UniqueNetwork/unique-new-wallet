import { Button, Heading, Icon, Loader, useNotifications } from '@unique-nft/ui-kit';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useGraphQlCollectionTokens } from '@app/api/graphQL/tokens/useGraphQlCollectionTokens';
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
import { DEFAULT_ITEMS_COUNT, useAccounts } from '@app/hooks';
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
import { useCollectionBurn } from '@app/api/restApi/collection/useCollectionBurn';

import { useNftFilterContext } from '../../components/CollectionNftFilters/context';

const CollectionSettings = () => {
  const { error } = useNotifications();
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [nestingStep, setNestingStep] = useState(false);
  const [sponsorStep, setSponsorStep] = useState(false);
  const [limitStep, setLimitStep] = useState(false);
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
  const { submitWaitResult: submitWaitResultCollectionburn } = useCollectionBurn();
  const { selectedAccount } = useAccounts();
  const navigate = useNavigate();
  const { collectionId } = useParams<'collectionId'>();
  const { search, direction, page, type } = useNftFilterContext();

  const { tokensCount } = useGraphQlCollectionTokens({
    collectionId: parseInt(collectionId || ''),
    collectionOwner: selectedAccount?.address,
    filter: {
      search,
      type,
    },
    options: {
      skip: !selectedAccount?.address,
      direction,
      pagination: {
        page,
        limit: DEFAULT_ITEMS_COUNT,
      },
    },
  });

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
    watch,
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
    const subscription = watch((value, { name, type }) => {
      if (name === 'nesting') {
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
      if (name === 'newSponsor') {
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

      if (name === 'ownerCanDestroy' || name === 'tokenLimit') {
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
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

  useEffect(() => {
    changeStep('Setting up collection permissions', nestingStep);
  }, [nestingStep]);

  useEffect(() => {
    changeStep('Setting up collection sponsor', sponsorStep);
  }, [sponsorStep]);

  useEffect(() => {
    changeStep('Setting up token limit', limitStep);
  }, [limitStep]);

  const changeStep = (stepName: string, status: boolean) => {
    const stepsArr = steps;
    const foundIndex = stepsArr.findIndex((step) => {
      return step.name === stepName;
    });
    if (foundIndex >= 0) {
      stepsArr[foundIndex].pending = status;
      setSteps(stepsArr);
    }
  };

  const submitHandler = () => {
    const { ownerCanDestroy, nesting, newSponsor, tokenLimit } = dirtyFields;
    const stepArr: Step[] = [];
    if (ownerCanDestroy || tokenLimit) {
      setVisibleConfirmModal(true);
      setLimitStep(true);
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
      })
        .then(() => {
          setLimitStep(false);
        })
        .catch(() => {
          setLimitStep(false);
        });
    }
    if (nesting) {
      setVisibleConfirmModal(true);
      setNestingStep(true);
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
      })
        .then(() => {
          setNestingStep(false);
        })
        .catch(() => {
          setNestingStep(false);
        });
    }
    if (newSponsor) {
      setVisibleConfirmModal(true);
      setSponsorStep(true);
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
      })
        .then(() => {
          setSponsorStep(false);
        })
        .catch(() => {
          setSponsorStep(false);
        });
    }
    setSteps(stepArr);
  };

  const handleBurnCollection = () => {
    setVisibleConfirmModal(true);
    setSteps([
      {
        name: 'Burn collection',
        pending: true,
      },
    ]);

    submitWaitResultCollectionburn({
      payload: {
        address: selectedAccount!.address,
        collectionId: Number(collection_id),
      },
    })
      .then(() => {
        setVisibleConfirmModal(false);
        setSteps([
          {
            name: 'Burn collection',
            pending: false,
          },
        ]);
        navigate('/my-collections');
      })
      .catch(() => {
        setVisibleConfirmModal(false);
        setSteps([
          {
            name: 'Burn collection',
            pending: false,
          },
        ]);
      });

    // const { data } = await deleteCollection(api!, {
    //   collectionId: collection_id,
    //   address: selectedAccount.address,
    // });
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
                  name="ownerCanDestroy"
                  id="ownerCanDestroy"
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
              <SettingsButtonGroup>
                <TooltipWrapper message={<>The form in&nbsp;development progress</>}>
                  <Button title="Save changes" onClick={submitHandler} />
                </TooltipWrapper>
                {ownerCanDestroy && (
                  <>
                    <TooltipWrapper
                      align={{
                        vertical: 'top',
                        horizontal: 'left',
                        appearance: 'horizontal',
                      }}
                      message="You cannot burn a collection if it contains tokens"
                    >
                      <Button
                        title="Burn collection"
                        className={tokensCount !== 0 ? 'disable' : ''}
                        iconLeft={{
                          size: 15,
                          name: 'burn',
                          color:
                            tokensCount !== 0
                              ? 'var(--color-grey-500)'
                              : 'var(--color-coral-500)',
                        }}
                        role="ghost"
                        onClick={() => {
                          if (tokensCount === 0) {
                            handleBurnCollection();
                          }
                        }}
                      />
                    </TooltipWrapper>
                  </>
                )}
              </SettingsButtonGroup>
            </FormProvider>
          </>
        )}
      </FormWrapper>
      <SettingsCollectionModal
        title="Please wait"
        steps={steps}
        isVisible={isVisibleConfirmModal}
        onConfirm={() => {}}
        onClose={() => setVisibleConfirmModal(false)}
      />
    </PagePaper>
  );
};

const SettingsButtonGroup = styled(ButtonGroup)`
  justify-content: space-between;
  .unique-button.ghost {
    padding: 0;
    color: var(--color-coral-500);
  }
  .unique-button.disable {
    pointer-events: none;
    color: var(--color-grey-500);
  }
`;

export default CollectionSettings;
