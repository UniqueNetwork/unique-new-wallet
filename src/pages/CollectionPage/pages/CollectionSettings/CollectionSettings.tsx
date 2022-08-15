import { createRef, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Heading,
  Icon,
  InputText,
  Loader,
  Text,
  Tooltip,
  TooltipAlign,
} from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { PagePaper, StatusTransactionModal, TooltipButtonWrapper } from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { getSponsorShip } from '@app/pages/CollectionPage/utils';
import { BurnCollectionModal } from '@app/pages/CollectionNft/components/BurnCollectionModal';
import { useAccounts } from '@app/hooks';
import {
  ButtonGroup,
  Form,
  FormBody,
  FormHeader,
  FormRow,
  FormWrapper,
  SettingsRow,
} from '@app/pages/components/FormComponents';
import { maxTokenLimit } from '@app/pages/constants/token';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

const addressTooltip = createRef<HTMLDivElement>();
const destroyTooltip = createRef<HTMLDivElement>();
const tokenTooltip = createRef<HTMLDivElement>();
const tooltipAlign: TooltipAlign = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
};

const CollectionSettings = () => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collection, isCollectionFetching } = useCollectionContext() || {};
  const { selectedAccount } = useAccounts();
  const [isLoadingBurnCollection, setLoadingBurnCollection] = useState(false);
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
        {isCollectionFetching ? (
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
                        <Tooltip align={tooltipAlign} targetRef={addressTooltip}>
                          The collection sponsor pays for all transactions related to this
                          collection. You can set as a sponsor a regular account or a
                          market contract. The sponsor will need to confirm the
                          sponsorship before the sponsoring begins
                        </Tooltip>
                        <Icon
                          ref={addressTooltip}
                          name="question"
                          size={22}
                          color="var(--color-primary-500)"
                        />
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
                        <Tooltip align={tooltipAlign} targetRef={tokenTooltip}>
                          The token limit (collection size) is a mandatory parameter if
                          you want to list your collection on a marketplace.
                        </Tooltip>
                        <Icon
                          ref={tokenTooltip}
                          name="question"
                          size={22}
                          color="var(--color-primary-500)"
                        />
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
                        <Tooltip align={tooltipAlign} targetRef={destroyTooltip}>
                          Should you decide to keep the right to destroy the collection, a
                          marketplace could reject it depending on its policies as it
                          gives the author the power to arbitrarily destroy a collection
                          at any moment in the future
                        </Tooltip>
                        <Icon
                          ref={destroyTooltip}
                          name="question"
                          size={22}
                          color="var(--color-primary-500)"
                        />
                      </>
                    }
                    disabled={!ownerCanDestroy}
                    onChange={(value) => {
                      // form.setFieldValue('ownerCanDestroy', value);
                    }}
                  />
                </SettingsRow>
                <ButtonGroup>
                  <TooltipButtonWrapper message="The form in development progress">
                    <Button title="Save changes" disabled={true} type="submit" />
                  </TooltipButtonWrapper>
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
              </Form>
            </FormBody>
          </>
        )}
      </FormWrapper>
      <StatusTransactionModal
        isVisible={isLoadingBurnCollection}
        description="Burning collection"
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
