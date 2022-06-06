import { useState } from 'react';
import { Heading, Text, InputText, Checkbox, Button, Loader } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { PagePaper, StatusTransactionModal } from '@app/components';
import { useCollectionContext } from '@app/pages/CollectionPage/useCollectionContext';
import { getSponsorShip } from '@app/pages/CollectionPage/utils';
import { BurnCollectionModal } from '@app/pages/CollectionNft/components/BurnCollectionModal';
import { useAccounts, useApi } from '@app/hooks';
import { deleteCollection } from '@app/api/restApi/collection';
import { extrinsicSubmit } from '@app/api/restApi/extrinsic';

const CollectionSettings = () => {
  const [isVisibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const { collection, isCollectionFetching } = useCollectionContext() || {};
  const { selectedAccount, signMessage } = useAccounts();
  const [isLoadingBurnCollection, setLoadingBurnCollection] = useState(false);
  const navigate = useNavigate();
  const { api } = useApi();

  const {
    token_limit,
    owner_can_destroy,
    sponsorship = null,
    collection_id,
  } = collection || {};
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

  const handleBurnCollection = async () => {
    if (!collection_id || !selectedAccount) {
      return;
    }

    setVisibleConfirmModal(false);
    setLoadingBurnCollection(true);

    try {
      const { data } = await deleteCollection(api!, {
        collectionId: collection_id,
        address: selectedAccount.address,
      });

      const signature = await signMessage(data.signerPayloadJSON, selectedAccount);

      await extrinsicSubmit(api!, {
        signerPayloadJSON: { ...data.signerPayloadJSON },
        signature,
      });
      navigate('/my-collections');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBurnCollection(false);
    }
  };

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
              <Button title="Save changes" disabled={true} type="submit" />
              {ownerCanDestroy && (
                <Button
                  title="Burn collection"
                  iconLeft={{ size: 15, name: 'burn', color: 'var(--color-coral-500)' }}
                  role="ghost"
                  onClick={() => setVisibleConfirmModal(true)}
                />
              )}
            </ButtonsWrapper>
          </form>
        )}
      </SettingsContainer>
      <StatusTransactionModal
        isVisible={isLoadingBurnCollection}
        description="Burning collection"
      />

      <BurnCollectionModal
        isVisible={isVisibleConfirmModal}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirm={handleBurnCollection}
        onClose={() => setVisibleConfirmModal(false)}
      />
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
