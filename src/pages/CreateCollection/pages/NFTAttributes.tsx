import React, { useContext, useEffect, useMemo, useState } from 'react';
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
} from '@unique-nft/ui-kit';

import { ArtificialAttributeItemType } from '@app/types';
import { CollectionFormContext, defaultAttributesWithTokenIpfs } from '@app/context';
import { useCollectionMutation } from '@app/hooks';
import {
  Alert,
  CollectionStepper,
  Confirm,
  StatusTransactionModal,
} from '@app/components';
import { AttributesTable } from '@app/pages/CreateCollection/pages/components';
import {
  ButtonGroup,
  FormBody,
  FormHeader,
  FormWrapper,
} from '@app/pages/components/FormComponents';
import { maxTokenLimit } from '@app/pages/constants/token';
import { ROUTE } from '@app/routes';

export const NFTAttributes = () => {
  const {
    attributes,
    mainInformationForm,
    setAttributes,
    tokenLimit,
    setTokenLimit,
    ownerCanDestroy,
    setOwnerCanDestroy,
  } = useContext(CollectionFormContext);
  const navigate = useNavigate();
  const { isCreatingCollection, onCreateCollection } = useCollectionMutation();
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  const { fee, generateExtrinsic } = useCollectionMutation();
  const [address, setAddress] = useState<string>('');

  const onPreviousStepClick = () => {
    navigate('/create-collection/main-information');
  };

  const createCollection = async () => {
    await onCreateCollection();

    navigate(ROUTE.MY_COLLECTIONS);
  };

  const onSubmitAttributes = () => {
    const { isSubmitting, isValid } = mainInformationForm;

    if (isSubmitting && isValid) {
      if (attributes?.length < 2) {
        setIsOpenConfirm(true);
      } else {
        void createCollection();
      }
    }
  };

  const onSetTokenLimit = (value: string) => {
    if (!value) {
      setTokenLimit(null);
      return;
    }

    const numVal = Number(value);

    if (numVal > maxTokenLimit || numVal < 0) {
      return;
    }

    setTokenLimit(numVal);
  };

  const onSetAttributes = (attributes: ArtificialAttributeItemType[]) => {
    setAttributes([...attributes, ...defaultAttributesWithTokenIpfs]);

    void generateExtrinsic();
  };

  const attributesWithoutIpfs = useMemo(
    () => attributes.filter((attr) => attr.name !== 'ipfsJson'),
    [attributes],
  );

  // !!!Only for the first render!
  useEffect(() => {
    void generateExtrinsic();
  }, []);

  return (
    <>
      <FormWrapper>
        <CollectionStepper activeStep={2} onClickStep={onPreviousStepClick} />
        <FormHeader>
          <Heading size="2">NFT attrubutes</Heading>
          <Text>
            Customize your token — define your NTF&apos;s traits: name, accessory, gender,
            background, face, body, tier, etc.
          </Text>
        </FormHeader>
        <FormBody>
          <AttributesTable value={attributesWithoutIpfs} onChange={onSetAttributes} />
          <AdvancedSettingsAccordion title="Advanced settings">
            <Row>
              <Text>This section contains marketplace related settings.</Text>
            </Row>
            <Row>
              <InputText
                label={
                  <>
                    Collection sponsor address
                    <Tooltip
                      content={
                        <Icon
                          name="question"
                          size={24}
                          color="var(--color-primary-500)"
                        />
                      }
                      placement="right-start"
                    >
                      The collection sponsor pays for all transactions related
                      to&nbsp;this collection. You can set as&nbsp;a&nbsp;sponsor
                      a&nbsp;regular account or&nbsp;a&nbsp;market contract. The sponsor
                      will need to&nbsp;confirm the sponsorship before the sponsoring
                      begins
                    </Tooltip>
                  </>
                }
                additionalText="The designated sponsor should approve the request"
                maxLength={48}
                value={address}
                onChange={setAddress}
              />
              <Heading size="4">One-time install options</Heading>
              <Text>
                One-time options cannot be changed once set. They are &apos;baked-in&apos;
                at the time of collection creation. They can be left unchanged in this
                settings page, but the final parameters should be set/reviewed in the
                &apos;Settings&apos; tab in the collection detail panel.
              </Text>
            </Row>
            <Row>
              <InputText
                label={
                  <>
                    Token limit
                    <Tooltip
                      content={
                        <Icon
                          name="question"
                          size={24}
                          color="var(--color-primary-500)"
                        />
                      }
                      placement="right-start"
                    >
                      The token limit (collection size) is&nbsp;a&nbsp;mandatory parameter
                      if&nbsp;you want to&nbsp;list your collection
                      on&nbsp;a&nbsp;marketplace.
                    </Tooltip>
                  </>
                }
                additionalText="Unlimited by default"
                value={tokenLimit ? tokenLimit.toString() : ''}
                onChange={onSetTokenLimit}
              />
            </Row>
            <Row>
              <CheckboxWrapper>
                <Checkbox
                  label="Owner can burn collection"
                  checked={ownerCanDestroy}
                  onChange={setOwnerCanDestroy}
                />
                <Tooltip
                  content={
                    <Icon name="question" size={24} color="var(--color-primary-500)" />
                  }
                  placement="right-start"
                >
                  Should you decide to&nbsp;keep the right to&nbsp;destroy the collection,
                  a&nbsp;marketplace could reject it&nbsp;depending on&nbsp;its policies
                  as&nbsp;it&nbsp;gives the author the power to&nbsp;arbitrarily destroy
                  a&nbsp;collection at&nbsp;any moment in&nbsp;the future
                </Tooltip>
              </CheckboxWrapper>
            </Row>
          </AdvancedSettingsAccordion>
          <Alert type="warning" className="alert-wrapper">
            A fee of ~ {fee} can be applied to the transaction
          </Alert>
          <ButtonGroup>
            <Button
              iconLeft={{
                color: 'var(--color-primary-400)',
                name: 'arrow-left',
                size: 12,
              }}
              title="Previous step"
              onClick={onPreviousStepClick}
            />
            <Button
              title="Create a collection"
              type="button"
              role="primary"
              onClick={onSubmitAttributes}
            />
          </ButtonGroup>
        </FormBody>
      </FormWrapper>
      <Confirm
        buttons={[
          { title: 'No, return', onClick: () => setIsOpenConfirm(false) },
          {
            title: 'Yes, I am sure',
            role: 'primary',
            onClick: () => {
              setIsOpenConfirm(false);
              void onCreateCollection();
            },
          },
        ]}
        isVisible={isOpenConfirm}
        title="You have not entered attributes. Are you sure that you want to create the collection without them?"
        onClose={() => setIsOpenConfirm(false)}
      >
        <Text>You cannot return to editing the attributes in this product version.</Text>
      </Confirm>
      <StatusTransactionModal
        isVisible={isCreatingCollection}
        description="Creating collection"
      />
    </>
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

const CheckboxWrapper = styled.div`
  white-space: nowrap;

  .unique-checkbox-wrapper {
    display: inline-block;
    vertical-align: middle;
  }
`;

const Row = styled.div`
  &:not(:last-child) {
    margin-bottom: calc(var(--prop-gap) * 1.5);
  }

  label {
    font-weight: 500;
  }

  label,
  ${CheckboxWrapper} {
    & > .unique-tooltip-content {
      display: inline-block;
      vertical-align: middle;
      margin: -0.1em 0 0 0.25em;
    }
  }

  .unique-input-text {
    & + .unique-font-heading {
      margin-top: calc(var(--prop-gap) * 0.375);
    }
  }
`;
