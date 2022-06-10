import { VFC, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import {
  Heading,
  InputText,
  Button,
  Text,
  Checkbox,
  Accordion,
} from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { CollectionFormContext } from '@app/context';
import { Alert, CollectionStepper } from '@app/components';
import { AttributesTable } from '@app/pages/CreateCollection/pages/components';

export interface NFTAttributesComponentProps {
  className?: string;
}

const NFTAttributesComponent: VFC<NFTAttributesComponentProps> = ({ className }) => {
  const {
    attributes,
    setAttributes,
    tokenLimit,
    setTokenLimit,
    ownerCanDestroy,
    setOwnerCanDestroy,
  } = useContext(CollectionFormContext);
  const navigate = useNavigate();

  const onPreviousStepClick = useCallback(() => {
    navigate('/create-collection/main-information/');
  }, []);

  return (
    <div className={classNames('main-information', className)}>
      <CollectionStepper activeStep={2} />
      <Heading size="2">NFT attrubutes</Heading>
      <Text>
        Customize your token — define your NTF&apos;s traits: name, accessory, gender,
        background, face, body, tier, etc.
      </Text>
      <div>
        <AttributesTable value={attributes} onChange={setAttributes} />
        <AdvancedSettingsAccordion title="Advanced settings ">
          <AdvancedSettingsWrapper>
            <Text>This section contains marketplace related settings.</Text>
            <InputText
              label="Collection sponsor address"
              additionalText="The designated sponsor should approve the request"
            />
            <div>
              <Heading size="4">One-time install options</Heading>
              <Text>
                One-time options cannot be changed once set. They are &apos;baked-in&apos;
                at the time of collection creation. They can be left unchanged in this
                settings page, but the final parameters should be set/reviewed in the
                &apos;Settings&apos; tab in the collection detail panel.
              </Text>
            </div>
            <InputText
              label="Token limit"
              additionalText="Unlimited by default"
              value={tokenLimit}
              onChange={setTokenLimit}
            />
            <Checkbox
              label="Owner can burn collection"
              checked={ownerCanDestroy}
              onChange={setOwnerCanDestroy}
            />
          </AdvancedSettingsWrapper>
        </AdvancedSettingsAccordion>
        <Alert type="warning" className="alert-wrapper">
          A fee of ~ 2.073447 QTZ can be applied to the transaction
        </Alert>
        <div className="nft-attributes-buttons">
          <Button
            iconLeft={{
              color: 'var(--color-primary-400)',
              name: 'arrow-left',
              size: 12,
            }}
            title="Previous step"
            onClick={onPreviousStepClick}
          />
          <Button title="Create a collection" type="submit" role="primary" />
        </div>
      </div>
    </div>
  );
};

const AdvancedSettingsAccordion = styled(Accordion)`
  margin-top: calc(var(--prop-gap) * 2.5);
  .unique-accordion-title {
    font-size: 24px;
    line-height: 32px;
  }
`;

const AdvancedSettingsWrapper = styled.div`
  margin-top: calc(var(--prop-gap) / 2);
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--prop-gap) * 1.5);
`;

export const NFTAttributes = styled(NFTAttributesComponent)`
  .nft-attributes-buttons {
    margin-top: calc(var(--prop-gap) * 1.5);
    display: flex;
    column-gap: var(--prop-gap);
  }

  .alert-wrapper {
    margin-top: calc(var(--prop-gap) * 2.5);
  }
`;
