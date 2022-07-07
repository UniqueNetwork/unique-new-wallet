import React, { useContext, useEffect, useState, VFC } from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import { Avatar, Button, Heading, Suggest, Text, Upload } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { Alert, StatusTransactionModal } from '@app/components';
import { useAccounts, useTokenMutation } from '@app/hooks';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { Collection, useFileUpload } from '@app/api';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { ROUTE } from '@app/routes';
import { TokenField } from '@app/types';
import { TokenFormContext } from '@app/context';
import { AttributesRow } from '@app/pages/CreateNFT/AttributesRow';
import { useCollectionQuery } from '@app/api/restApi/collection/hooks/useCollectionQuery';
import { Sidebar } from '@app/pages/CreateNFT/Sidebar';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import {
  AdditionalText,
  ButtonGroup,
  Form,
  FormBody,
  FormHeader,
  FormRow,
  FormRowEmpty,
  FormWrapper,
  LabelText,
  SuggestOption,
  UploadWidget,
} from '@app/pages/components/FormComponents';

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
  const { initializeTokenForm, setTokenImg, tokenForm } = useContext(TokenFormContext);
  const { selectedAccount } = useAccounts();
  const { uploadFile } = useFileUpload();
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState<Option | null>(null);
  // TODO - use searchOnType here
  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: defaultOptions,
  });
  const { data: collection } = useCollectionQuery(selectedCollection?.id ?? 0);
  const { fee, generateExtrinsic, isCreatingNFT, onCreateNFT } = useTokenMutation(
    selectedCollection?.id ?? 0,
  );
  const { dirty, isValid, setFieldValue, submitForm, values } = tokenForm;

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

    setFieldValue('ipfsJson', JSON.stringify({ ipfs: response?.cid, type: 'image' }));
  };

  const setImage = (data: { url: string; file: Blob } | null) => {
    if (data?.file) {
      const file: Blob = data?.file;

      setTokenImg(file);

      void uploadImage(file);
    }
  };

  const onConfirmAndClose = async () => {
    await submitForm();
    await onCreateNFT();

    navigate(ROUTE.MY_TOKENS);
  };

  const onConfirmAndCreateMore = async () => {
    await submitForm();
    await onCreateNFT();
  };

  useEffect(() => {
    if (tokenFields?.length) {
      initializeTokenForm(tokenFields);
    }
  }, [tokenFields]);

  // !!!Only for attributes change
  useEffect(() => {
    void generateExtrinsic();
  }, [values]);

  const disabled = !values.ipfsJson || !dirty || !isValid;

  return (
    <>
      <Heading size="1">Create a NFT</Heading>
      <MainWrapper className={classNames('create-nft-page', className)}>
        <WrapperContent>
          <FormWrapper>
            <FormHeader>
              <Heading size="2">Main information</Heading>
            </FormHeader>
            <FormBody>
              <Form>
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
                    isLoading={isCollectionsLoading}
                    getActiveSuggestOption={(option: Option, activeOption: Option) =>
                      option.id === activeOption.id
                    }
                    getSuggestionValue={({ title }: Option) => title}
                    onChange={setSelectedCollection}
                  />
                </FormRow>
                <FormRow className="has_uploader">
                  <UploadWidget>
                    <LabelText>Upload image*</LabelText>
                    <AdditionalText>Choose JPG, PNG, GIF (max 10 Mb)</AdditionalText>
                    {/* TODO - fix UI kit Upload problems: set value as url from file, reloading */}
                    <Upload
                      disabled={!selectedCollection?.id}
                      type="square"
                      onChange={setImage}
                    />
                  </UploadWidget>
                </FormRow>
                <Heading size="3">Attributes</Heading>
                {selectedCollection ? (
                  tokenFields
                    .filter((tokenField: TokenField) => tokenField.name !== 'ipfsJson')
                    .map((tokenField: TokenField, index: number) => (
                      <AttributesRow
                        // generateExtrinsic={generateExtrinsic}
                        tokenField={tokenField}
                        key={`${tokenField.name}-${index}`}
                        maxLength={64}
                      />
                    ))
                ) : (
                  <FormRowEmpty>
                    <Text color="grey-500" size="s">
                      Will become available after selecting a collection
                    </Text>
                  </FormRowEmpty>
                )}
                <Alert type="warning">
                  A fee of ~ {fee} QTZ can be applied to the transaction
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
            </FormBody>
          </FormWrapper>
        </WrapperContent>
        <Sidebar collectionId={selectedCollection?.id} />
      </MainWrapper>
      <StatusTransactionModal isVisible={isCreatingNFT} description="Creating NFT" />
    </>
  );
};
