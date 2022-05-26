import { Heading, Text, InputText, Checkbox, Button, Loader } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { useFormik } from 'formik';

import { PagePaper } from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { getSponsorShip } from '@app/pages/CollectionPage/utils';

const CollectionSettings = () => {
  const { collection, isCollectionFetching } = useCollectionContext() || {};

  const { token_limit, owner_can_destroy, sponsorship = null } = collection || {};
  const ownerCanDestroy = Boolean(owner_can_destroy) !== false;

  const form = useFormik({
    initialValues: {
      address: getSponsorShip(sponsorship)?.value || '',
      limit: token_limit || 0,
      ownerCanDestroy,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <PagePaper>
      <SettingsContainer>
        {isCollectionFetching ? (
          <Loader />
        ) : (
          <form onSubmit={form.handleSubmit}>
            <Heading size="3">Advanced settings</Heading>
            <Text>
              These settings are intended for users who want to place their collection on
              the marketplace.
            </Text>

            <SettingsInput
              // TODO: icon tooltip
              label="Collection sponsor address"
              additionalText="The designated sponsor should approve the request"
              id="address"
              value={form.values.address}
              onChange={(value) => {
                form.setFieldValue('address', value);
              }}
            />

            <Heading size="4">One-time install options</Heading>
            <Text>
              Please note that once installed, these settings cannot be changed later. If
              you do not change them now, you can change them once on the Settings tab in
              the collection detail card.
            </Text>

            <SettingsInput
              // TODO: icon tooltip
              label="Token limit"
              additionalText="Unlimited by default"
              id="limit"
              value={form.values.limit.toString()}
              role="number"
              onChange={(value) => {
                form.setFieldValue('limit', value);
              }}
            />

            <Checkbox
              checked={form.values.ownerCanDestroy}
              // TODO: icon tooltip
              label="Owner can burn collection"
              disabled={!ownerCanDestroy}
              onChange={(value) => {
                form.setFieldValue('ownerCanDestroy', value);
              }}
            />

            <ButtonsWrapper>
              <Button title="Save changes" type="submit" />
              {ownerCanDestroy && (
                <Button
                  title="Burn collection"
                  iconLeft={{ size: 15, name: 'burn', color: 'var(--color-coral-500)' }}
                  role="ghost"
                />
              )}
            </ButtonsWrapper>
          </form>
        )}
      </SettingsContainer>
    </PagePaper>
  );
};

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
