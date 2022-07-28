import React, { createRef, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Accordion,
  Button,
  Checkbox,
  Heading,
  Icon,
  InputText,
  Text,
  Tooltip,
  TooltipAlign,
  useNotifications,
} from '@unique-nft/ui-kit';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { useAccounts, useBalanceInsufficient } from '@app/hooks';
import { ArtificialAttributeItemType } from '@app/types';
// import { CollectionFormContext, defaultAttributesWithTokenIpfs } from '@app/context';
import {
  Alert,
  CollectionStepper,
  Confirm,
  StatusTransactionModal,
  TooltipButtonWrapper,
} from '@app/components';
import { NO_BALANCE_MESSAGE } from '@app/pages';
import { CREATE_COLLECTION_TABS_ROUTE, ROUTE } from '@app/routes';
import { AttributesTable } from '@app/pages/CreateCollection/components';
import {
  ButtonGroup,
  FormBody,
  FormHeader,
  FormRow,
  FormWrapper,
  SettingsRow,
} from '@app/pages/components/FormComponents';
import { maxTokenLimit } from '@app/pages/constants/token';
import { CollectionApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';
import { InputController } from '@app/components/FormControllerComponents';
import { useCollectionFormContext } from '@app/context/CollectionFormContext/useCollectionFormContext';
import { CheckboxController } from '@app/components/FormControllerComponents/CheckboxController';

const addressTooltip = createRef<HTMLDivElement>();
const burnTooltip = createRef<HTMLDivElement>();
const limitTooltip = createRef<HTMLDivElement>();
const tooltipAlign: TooltipAlign = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
};

export const NFTAttributes = () => {
  // const {
  //   attributes = [],
  //   mainInformationForm,
  //   setAttributes,
  //   tokenLimit,
  //   setTokenLimit,
  //   ownerCanDestroy,
  //   setOwnerCanDestroy,
  //   mapFormToCollectionDto,
  // } = useContext(CollectionFormContext);
  const { selectedAccount } = useAccounts();
  const navigate = useNavigate();
  // const { info, error } = useNotifications();
  // const { data } = useCollectionFormContext();

  const collectionNftAttributesForm = useFormContext<any>();

  console.log(collectionNftAttributesForm.getValues());

  const attributesArrayField: any = useFieldArray({
    control: collectionNftAttributesForm.control,
    name: 'attributes',
  });

  console.log(attributesArrayField.fields);

  // const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  // const { feeError, isFeeError, getFee, fee, feeFormatted } = useExtrinsicFee(
  //   CollectionApiService.collectionCreateMutation,
  // );
  // const { isBalanceInsufficient } = useBalanceInsufficient(selectedAccount?.address, fee);

  // const nftFormValues = useWatch({
  //   control: collectionNftAttributesForm.control,
  // });

  // const [nftDebounceValue] = useDebounce(nftFormValues, 500);

  // useEffect(() => {
  //   if (!data) {
  //     navigate(
  //       `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION}`,
  //       {
  //         replace: true,
  //       },
  //     );
  //   }
  // }, [data, navigate]);

  // useEffect(() => {
  //   getFee({
  //     collection: nftDebounceValue,
  //   });
  // }, [nftDebounceValue]);

  // useEffect(() => {
  //   if (flowStatus === 'success') {
  //     info('Collection created successfully');

  //     navigate(ROUTE.MY_COLLECTIONS);
  //   }
  //   if (flowStatus === 'error') {
  //     error(flowError?.message);
  //   }
  // }, [flowStatus]);

  // useEffect(() => {
  //   if (isFeeError && feeError) {
  //     error(feeError.message);
  //   }
  // }, [feeError, isFeeError]);

  // const onPreviousStepClick = () => {
  //   navigate(
  //     `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION}`,
  //   );
  // };

  // const onSubmitAttributes = (values: any) => {
  //   if (!selectedAccount) {
  //     error('Account is not found');
  //     return;
  //   }
  //   console.log(values);
  //   // signAndSubmitExtrinsic({
  //   //   collection: values,
  //   // });
  // };

  const handleAddAttributeItem = () => {
    attributesArrayField.append({
      name: { _: '' },
      optional: true,
      type: 'string',
    });
  };

  const onSetAttributes = (attributes: ArtificialAttributeItemType[]) => {
    console.log(attributes);
    // setAttributes([...attributes, ...defaultAttributesWithTokenIpfs]);
  };

  // const attributesWithoutIpfs = useMemo(
  //   () => attributes.filter((attr: any) => attr.name !== 'ipfsJson'),
  //   [attributes],
  // );

  return (
    <FormProvider {...collectionNftAttributesForm}>
      <FormWrapper>
        {/* <CollectionStepper activeStep={2} onClickStep={onPreviousStepClick} /> */}
        <FormHeader>
          <Heading size="2">NFT attributes</Heading>
          <Text>
            Customize your token — define your NTF&apos;s traits: name, accessory, gender,
            background, face, body, tier, etc.
          </Text>
        </FormHeader>
        <FormBody>
          <AttributesTable
            value={attributesArrayField.fields}
            onAddAttributeItem={handleAddAttributeItem}
            onChange={onSetAttributes}
          />
          <AdvancedSettingsAccordion title="Advanced settings">
            <SettingsRow>
              <Text>This section contains marketplace related settings.</Text>
            </SettingsRow>
            <SettingsRow>
              <InputController
                name="sponsorship.address"
                label={
                  <>
                    Collection sponsor address
                    <Tooltip align={tooltipAlign} targetRef={addressTooltip}>
                      The collection sponsor pays for all transactions related
                      to&nbsp;this collection. You can set as&nbsp;a&nbsp;sponsor
                      a&nbsp;regular account or&nbsp;a&nbsp;market contract. The sponsor
                      will need to&nbsp;confirm the sponsorship before the sponsoring
                      begins
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
                maxLength={48}
              />
            </SettingsRow>
            <FormRow>
              <Heading size="4">One-time install options</Heading>
              <Text>
                One-time options cannot be changed once set. They are &apos;baked-in&apos;
                at the time of collection creation. They can be left unchanged in this
                settings page, but the final parameters should be set/reviewed in the
                &apos;Settings&apos; tab in the collection detail panel.
              </Text>
            </FormRow>
            <SettingsRow>
              <InputController<string, number | null>
                name="limits.tokenLimit"
                label={
                  <>
                    Token limit
                    <Tooltip align={tooltipAlign} targetRef={limitTooltip}>
                      The token limit (collection size) is&nbsp;a&nbsp;mandatory parameter
                      if&nbsp;you want to&nbsp;list your collection
                      on&nbsp;a&nbsp;marketplace.
                    </Tooltip>
                    <Icon
                      ref={limitTooltip}
                      name="question"
                      size={22}
                      color="var(--color-primary-500)"
                    />
                  </>
                }
                additionalText="Unlimited by default"
                role="number"
                transform={{
                  output: (value) => {
                    const valueNumber = Number(value);
                    if (!valueNumber) {
                      return null;
                    }
                    if (valueNumber > maxTokenLimit || valueNumber < 0) {
                      return Number(value.slice(0, -1));
                    }
                    return valueNumber;
                  },
                }}
              />
            </SettingsRow>
            <SettingsRow>
              <CheckboxController
                name="limits.ownerCanDestroy"
                label={
                  <>
                    Owner can burn collection
                    <Tooltip align={tooltipAlign} targetRef={burnTooltip}>
                      Should you decide to&nbsp;keep the right to&nbsp;destroy the
                      collection, a&nbsp;marketplace could reject it&nbsp;depending
                      on&nbsp;its policies as&nbsp;it&nbsp;gives the author the power
                      to&nbsp;arbitrarily destroy a&nbsp;collection at&nbsp;any moment
                      in&nbsp;the future
                    </Tooltip>
                    <Icon
                      ref={burnTooltip}
                      name="question"
                      size={22}
                      color="var(--color-primary-500)"
                    />
                  </>
                }
              />
            </SettingsRow>
          </AdvancedSettingsAccordion>
          {/* {feeFormatted && (
            <Alert type="warning">
              A fee of ~ {feeFormatted} can be applied to the transaction
            </Alert>
          )} */}
          {/* <ButtonGroup>
            <Button
              iconLeft={{
                color: 'var(--color-primary-400)',
                name: 'arrow-left',
                size: 12,
              }}
              title="Previous step"
              onClick={onPreviousStepClick}
            />
            {isBalanceInsufficient ? (
              <TooltipButtonWrapper message={NO_BALANCE_MESSAGE}>
                <Button
                  disabled={true}
                  title="Create a collection"
                  type="button"
                  role="primary"
                />
              </TooltipButtonWrapper>
            ) : (
              <Button
                title="Create a collection"
                type="submit"
                role="primary"
                onClick={collectionNftAttributesForm.handleSubmit(onSubmitAttributes)}
              />
            )}
          </ButtonGroup> */}
        </FormBody>
      </FormWrapper>
      {/* <Confirm
        buttons={[
          { title: 'No, return', onClick: () => setIsOpenConfirm(false) },
          {
            title: 'Yes, I am sure',
            role: 'primary',
            onClick: () => {
              setIsOpenConfirm(false);
              // createCollectionHandler();
            },
          },
        ]}
        isVisible={isOpenConfirm}
        title="You have not entered attributes. Are you sure that you want to create the collection without them?"
        onClose={() => setIsOpenConfirm(false)}
      >
        <Text>You cannot return to editing the attributes in this product version.</Text>
      </Confirm> */}
      {/* <StatusTransactionModal
        isVisible={isFlowLoading}
        description="Creating collection"
      /> */}
    </FormProvider>
  );
};

const AdvancedSettingsAccordion = styled(Accordion)`
  margin-bottom: calc(var(--prop-gap) * 1.5);

  .unique-accordion-title {
    font-size: 24px;
    line-height: 32px;
  }

  &.expanded .unique-accordion-content {
    padding: calc(var(--prop-gap) / 2) 0 0;
  }
`;
