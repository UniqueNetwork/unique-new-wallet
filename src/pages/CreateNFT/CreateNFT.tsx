import React, { useContext, useEffect, useState, VFC } from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import { Avatar, Button, Heading, Suggest, Upload } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { Alert, StatusTransactionModal } from '@app/components';
import { useAccounts, useFee, useTokenMutation } from '@app/hooks';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { Collection, useFileUpload } from '@app/api';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { Sidebar } from '@app/pages/CreateNFT/Sidebar';
import { TokenField } from '@app/types';
import { TokenFormContext } from '@app/context';
import { AttributesRow } from '@app/pages/CreateNFT/AttributesRow';
import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';

import {
  Attributes,
  AdditionalText,
  ButtonGroup,
  Form,
  FormRow,
  LabelText,
  MainWrapper,
  SuggestOption,
  UploadWidget,
  WrapperContent,
} from './components';

interface Option {
  id: number;
  title: string;
  description: string | undefined;
  img: string | undefined;
}

interface ICreateNFTProps {
  className?: string;
}

const defaultOptions = {
  skip: false,
  pagination: {
    page: 0,
    limit: 300,
  },
};

export const CreateNFT: VFC<ICreateNFTProps> = ({ className }) => {
  const { fee } = useFee();
  const { attributes, createSchema, setAttributes, setTokenImg, resetForm } =
    useContext(TokenFormContext);
  const { selectedAccount } = useAccounts();
  const { uploadFile } = useFileUpload();
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState<Option | null>(null);
  // TODO - remove this FAQ after uploadFile value fix and move to Formik
  const [reloadForm, toggleReload] = useState<boolean>(false);
  // TODO - use searchOnType here
  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: defaultOptions,
  });
  const { data: collection } = useCollectionQuery(selectedCollection?.id ?? 0);
  const { isCreatingNFT, onCreateNFT } = useTokenMutation(selectedCollection?.id ?? 0);

  const tokenFields = get(collection, 'properties.fields', []);

  const collectionsOptions: Option[] =
    collections?.map((collection: Collection) => ({
      id: collection.collection_id,
      title: collection.name,
      description: collection.description,
      img: getTokenIpfsUriByImagePath(collection.collection_cover),
    })) ?? [];

  const uploadImage = async (file: Blob) => {
    const response = await uploadFile(file);

    setAttributes({
      ...attributes,
      ipfsJson: JSON.stringify({ ipfs: response?.address, type: 'image' }),
    });
  };

  const setImage = (data: { url: string; file: Blob } | null) => {
    if (data?.file) {
      const file: Blob = data?.file;

      setTokenImg(file);

      void uploadImage(file);
    }
  };

  const onConfirmAndClose = async () => {
    await onCreateNFT();

    navigate('/my-tokens/nft');
  };

  // TODO - remove this FAQ after uploadFile value fix and move to Formik
  const onResetForm = () => {
    toggleReload(true);
    resetForm();

    setTimeout(() => {
      toggleReload(false);
    });
  };

  const onConfirmAndCreateMore = async () => {
    try {
      await onCreateNFT();
    } catch (error) {
      console.log('error', error);
    }

    onResetForm();
  };

  useEffect(() => {
    if (tokenFields?.length) {
      createSchema(tokenFields);
    }
  }, [tokenFields]);

  // TODO - add redirect to main page here if user has no collections
  if (!collections?.length && !isCollectionsLoading) {
    return null;
  }

  // TODO - add some loader here
  if (isCollectionsLoading) {
    return null;
  }

  const disabled = !attributes.ipfsJson;

  return (
    <>
      <Heading size="1">Create a NFT</Heading>
      <MainWrapper className={classNames('create-nft-page', className)}>
        <WrapperContent>
          {!reloadForm && (
            <Form>
              <Heading size="2">Main information</Heading>
              <FormRow>
                <LabelText>Collection*</LabelText>
                <Suggest
                  components={{
                    SuggestItem: ({
                      suggestion,
                      isActive,
                    }: {
                      suggestion: Option;
                      isActive?: boolean;
                    }) => {
                      return (
                        <SuggestOption
                          className={classNames('suggestion-item', {
                            isActive,
                          })}
                        >
                          <Avatar size={24} src={suggestion.img || ''} type="circle" />
                          {suggestion?.title} [id {suggestion?.id}]
                        </SuggestOption>
                      );
                    },
                  }}
                  suggestions={collectionsOptions}
                  isLoading={false}
                  getActiveSuggestOption={(option: Option, activeOption: Option) =>
                    option.id === activeOption.id
                  }
                  getSuggestionValue={({ title }: Option) => title}
                  onChange={setSelectedCollection}
                />
              </FormRow>
              <FormRow>
                <UploadWidget>
                  <LabelText>Upload image*</LabelText>
                  <AdditionalText>Choose JPG, PNG, GIF (max 10 Mb)</AdditionalText>
                  {/* TODO - fix value problems, name attribute */}
                  <Upload
                    disabled={!selectedCollection?.id}
                    type="square"
                    onChange={setImage}
                  />
                </UploadWidget>
              </FormRow>
              <Heading size="3">Attributes</Heading>
              <Attributes>
                {tokenFields
                  .filter((tokenField: TokenField) => tokenField.name !== 'ipfsJson')
                  .map((tokenField: TokenField, index: number) => (
                    <AttributesRow
                      tokenField={tokenField}
                      key={`${tokenField.name}-${index}`}
                      maxLength={64}
                    />
                  ))}
              </Attributes>
              <Alert type="warning">
                {/* TODO - get fee from the API */}A fee of ~ {fee} QTZ can be applied to
                the transaction
              </Alert>
              <ButtonGroup>
                <Button
                  disabled={!selectedCollection?.id || disabled}
                  title="Confirm and create more"
                  role="primary"
                  onClick={() => void onConfirmAndCreateMore()}
                />
                <Button
                  disabled={!selectedCollection?.id || disabled}
                  title="Confirm and close"
                  onClick={() => void onConfirmAndClose()}
                />
              </ButtonGroup>
            </Form>
          )}
        </WrapperContent>
        <Sidebar collectionId={selectedCollection?.id} />
      </MainWrapper>
      <StatusTransactionModal isVisible={isCreatingNFT} description="Creating NFT" />
    </>
  );
};
