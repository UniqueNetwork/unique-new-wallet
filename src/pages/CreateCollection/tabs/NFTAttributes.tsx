import React, { createRef } from 'react';
import styled from 'styled-components';
import {
  Accordion,
  Heading,
  Icon,
  Text,
  Tooltip,
  TooltipAlign,
} from '@unique-nft/ui-kit';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { AttributesTable } from '@app/pages/CreateCollection/components';
import {
  FormBody,
  FormHeader,
  FormRow,
  SettingsRow,
} from '@app/pages/components/FormComponents';
import { InputController } from '@app/components/FormControllerComponents';
import { CheckboxController } from '@app/components/FormControllerComponents/CheckboxController';
import { maxTokenLimit } from '@app/pages/constants/token';

import { CollectionForm } from '../types';

const addressTooltip = createRef<HTMLDivElement>();
const burnTooltip = createRef<HTMLDivElement>();
const limitTooltip = createRef<HTMLDivElement>();
const tooltipAlign: TooltipAlign = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
};

export const NFTAttributes = () => {
  const { control, setValue } = useFormContext<CollectionForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  const addAttributeHandler = () => {
    append({
      name: '',
      type: { id: 'string', title: 'Text' },
      optional: { id: 'optional', title: 'Optional' },
      values: [],
    });
  };

  const removeAttributeHandler = (id: string) => {
    const attrIndex = fields.findIndex((f) => f.id === id);

    remove(attrIndex);
  };

  return (
    <>
      <FormHeader>
        <Heading size="2">NFT attributes</Heading>
        <Text>
          Customize your token — define your NTF&apos;s traits: name, accessory, gender,
          background, face, body, tier, etc.
        </Text>
      </FormHeader>
      <FormBody>
        <AttributesTable
          value={fields}
          onAddAttribute={addAttributeHandler}
          onRemoveAttribute={removeAttributeHandler}
        />
        <AdvancedSettingsAccordion title="Advanced settings">
          <SettingsRow>
            <Text>This section contains marketplace related settings.</Text>
          </SettingsRow>
          <SettingsRow>
            <InputController
              name="sponsorAddress"
              label={
                <>
                  Collection sponsor address
                  <Tooltip align={tooltipAlign} targetRef={addressTooltip}>
                    The collection sponsor pays for all transactions related to&nbsp;this
                    collection. You can set as&nbsp;a&nbsp;sponsor a&nbsp;regular account
                    or&nbsp;a&nbsp;market contract. The sponsor will need to&nbsp;confirm
                    the sponsorship before the sponsoring begins
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
            <InputController
              name="tokenLimit"
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
              name="ownerCanDestroy"
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
      </FormBody>
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
