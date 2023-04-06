import styled from 'styled-components';
import { Accordion, Checkbox, Heading, Icon, Text, Toggle } from '@unique-nft/ui-kit';
import { Controller } from 'react-hook-form';
import { Address } from '@unique-nft/utils';

import { InputText, TooltipWrapper } from '@app/components';
import {
  FormBody,
  FormHeader,
  FormRow,
  SettingsRow,
} from '@app/pages/components/FormComponents';
import { maxTokenLimit } from '@app/pages/constants/token';
import { DEFAULT_POSITION_TOOLTIP } from '@app/pages';

import { AttributesTable } from './AttributesTable';

export const NFTAttributes = () => {
  return (
    <>
      <FormHeader>
        <Heading size="2">NFT attributes</Heading>
        <Text>
          Customize your token — define your NFTs traits: name, accessory, gender,
          background, face, body, tier, etc.
        </Text>
      </FormHeader>
      <FormBody>
        <AttributesTable />
        <AdvancedSettingsAccordion title="Advanced settings">
          <FormRow>
            <Heading size="4">Nesting</Heading>
            <Text>
              A way to group tokens in a nested, tree-like structure within and NFT.
              Nesting of both NFTs and RFTs in unlimited quantities is supported.
            </Text>
          </FormRow>
          <SettingsRow>
            <Controller
              name="nesting.tokenOwner"
              render={({ field: { onChange, value } }) => {
                return (
                  <Toggle
                    label="Nesting enabled"
                    on={Boolean(value)}
                    size="m"
                    onChange={onChange}
                  />
                );
              }}
            />
          </SettingsRow>
          <SettingsRow>
            <Controller
              name="sponsorAddress"
              rules={{
                validate: (value) => {
                  if (value && !Address.is.validAddressInAnyForm(value)) {
                    return 'Sponsor address is not correct';
                  }
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                  error={!!error}
                  statusText={error?.message}
                  additionalText="The designated sponsor should approve the request"
                  maxLength={64}
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
              render={({ field: { onChange, value: currentValue } }) => (
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
                  additionalText="Value range 1 - 4,294,967,295. Unlimited by default."
                  role="number"
                  value={currentValue}
                  onChange={(value) => {
                    const parsed = Number(value);
                    if (!parsed) {
                      !value && onChange(value);
                    } else {
                      onChange(parsed > maxTokenLimit ? currentValue : parsed);
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
                        <Icon
                          name="question"
                          size={22}
                          color="var(--color-primary-500)"
                        />
                      </TooltipWrapper>
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

const AdvancedSettingsAccordion = styled(Accordion).attrs({ expanded: true })`
  margin-bottom: calc(var(--prop-gap) * 1.5);

  .unique-accordion-title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: calc(var(--prop-gap));
  }

  &.expanded .unique-accordion-content {
    padding: calc(var(--prop-gap) / 2) 0 0;
  }
`;
