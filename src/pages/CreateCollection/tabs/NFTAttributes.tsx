import React, { createRef } from 'react';
import styled from 'styled-components';
import {
  Accordion,
  Heading,
  Icon,
  InputText,
  Checkbox,
  Text,
  Tooltip,
  TooltipAlign,
} from '@unique-nft/ui-kit';
import { Controller } from 'react-hook-form';

import {
  FormBody,
  FormHeader,
  FormRow,
  SettingsRow,
} from '@app/pages/components/FormComponents';
import { maxTokenLimit } from '@app/pages/constants/token';

import { AttributesTable } from './AttributesTable';

const addressTooltip = createRef<HTMLDivElement>();
const burnTooltip = createRef<HTMLDivElement>();
const limitTooltip = createRef<HTMLDivElement>();
const tooltipAlign: TooltipAlign = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
};

export const NFTAttributes = () => {
  return (
    <>
      <FormHeader>
        <Heading size="2">NFT attributes</Heading>
        <Text>
          Customize your token — define your NFT&apos;s traits: name, accessory, gender,
          background, face, body, tier, etc.
        </Text>
      </FormHeader>
      <FormBody>
        <AttributesTable />
        <AdvancedSettingsAccordion title="Advanced settings">
          <SettingsRow>
            <Text>This section contains marketplace related settings.</Text>
          </SettingsRow>
          <SettingsRow>
            <Controller
              name="sponsorAddress"
              render={({ field: { onChange, value } }) => (
                <InputText
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
                  value={value}
                  onChange={onChange}
                />
              )}
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
            <Controller
              name="tokenLimit"
              render={({ field: { onChange, value } }) => (
                <InputText
                  label={
                    <>
                      Token limit
                      <Tooltip align={tooltipAlign} targetRef={limitTooltip}>
                        The token limit (collection size) is&nbsp;a&nbsp;mandatory
                        parameter if&nbsp;you want to&nbsp;list your collection
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
                  value={value}
                  onChange={(value) => {
                    const parsed = Number(value);
                    if (!parsed) {
                      !value && onChange(value);
                    } else {
                      onChange(
                        parsed > maxTokenLimit ? Number(value.slice(0, -1)) : parsed,
                      );
                    }
                  }}
                />
              )}
            />
          </SettingsRow>
          <SettingsRow>
            <Controller
              name="ownerCanDestroy"
              render={({ field: { value, onChange } }) => (
                <Checkbox
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
                  checked={value}
                  onChange={onChange}
                />
              )}
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
