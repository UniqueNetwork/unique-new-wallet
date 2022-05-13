import { Heading, Text, InputText, Checkbox, Button } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { PagePaper } from '@app/components';

const CollectionSettings = () => (
  <PagePaper>
    <SettingsContainer>
      <Heading size="3">Advanced settings</Heading>
      <Text>
        These settings are intended for users who want to place their collection on the
        marketplace.
      </Text>

      <SettingsInput
        // TODO: icon tooltip
        label="Collection sponsor address"
        additionalText="The designated sponsor should approve the request"
        id="address"
      />

      <Heading size="4">One-time install options</Heading>
      <Text>
        Please note that once installed, these settings cannot be changed later. If you do
        not change them now, you can change them once on the Settings tab in the
        collection detail card.
      </Text>

      <SettingsInput
        // TODO: icon tooltip
        label="Token limit"
        additionalText="Unlimited by default"
        id="limit"
      />

      <Checkbox
        checked={true}
        // TODO: icon tooltip
        label="Owner can burn collection"
        onChange={() => {
          console.log('checked');
        }}
      />

      <ButtonsWrapper>
        <Button title="Save changes" disabled={true} />
        <Button
          title="Burn collection"
          iconLeft={{ size: 15, name: 'burn', color: 'var(--color-coral-500)' }}
          role="ghost"
        />
      </ButtonsWrapper>
    </SettingsContainer>
  </PagePaper>
);

const SettingsContainer = styled.div`
  max-width: 756px;

  .unique-button.ghost {
    color: var(--color-coral-500);
    padding: 0;
  }

  .unique-font-heading.size-3 {
    margin-bottom: 5px;
  }
`;

const SettingsInput = styled(InputText)`
  width: 100%;
  margin: 25px 0;

  label {
    font-weight: 500;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
`;

export default CollectionSettings;
