import React, { useContext, useState, VFC } from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import { Avatar, Button, Heading, Suggest, Upload } from '@unique-nft/ui-kit';

import { Alert } from '@app/components';
import { useAccounts, useCollection, useFee } from '@app/hooks';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { Collection, useFileUpload, useTokenCreate } from '@app/api';
import { getCoverURLFromCollection } from '@app/utils';
import { Sidebar } from '@app/pages/CreateNFT/Sidebar';
import { AttributeItemType, TokenField } from '@app/types';
import { TokenFormContext } from '@app/context';
import { AttributesRow } from '@app/pages/CreateNFT/AttributesRow';

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

export const CreateNFT: VFC<ICreateNFTProps> = ({ className }) => {
  const { fee } = useFee();
  const { setTokenImg, tokenImg } = useContext(TokenFormContext);
  const { selectedAccount } = useAccounts();
  const { createToken } = useTokenCreate();
  const { uploadFile } = useFileUpload();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [traits, setTraits] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Option | null>(null);
  const { collections, collectionsLoading } = useGraphQlCollectionsByAccount(
    selectedAccount?.address ?? null,
  );
  const collection = useCollection(selectedCollection?.id ?? 0);
  const tokenFields = get(collection, 'properties.fields', []);

  console.log('collection!!!', collection);

  const collectionsOptions: Option[] =
    collections?.map((collection: Collection) => ({
      id: collection.collection_id,
      title: collection.name,
      description: collection.description,
      img: getCoverURLFromCollection(collection),
    })) ?? [];

  const setAttributeValue = (attribute: AttributeItemType, value: string | number[]) => {
    /* setTokenConstAttributes(
      (prevAttributes: { [key: string]: TokenAttribute }) =>
        ({
          ...prevAttributes,
          [attribute.name]: {
            name: prevAttributes[attribute.name].name,
            value:
              attribute.rule === 'repeated'
                ? prevAttributes[attribute.name].value
                : (value as string),
            values:
              attribute.rule === 'repeated'
                ? (value as number[])
                : prevAttributes[attribute.name].values,
          },
        } as { [key: string]: TokenAttribute }),
    ); */
  };

  const uploadImage = async (file: Blob) => {
    const response = await uploadFile(file);

    setAttributeValue(
      {
        fieldType: 'string',
        id: 1,
        name: 'ipfsJson',
        rule: 'required',
        values: [],
      },
      JSON.stringify({ ipfs: response?.address, type: 'image' }),
    );
  };

  const setImage = (data: { url: string; file: Blob } | null) => {
    if (data?.file) {
      const file: Blob = data?.file;

      setTokenImg(file);

      void uploadImage(file);
    }
  };

  console.log('collections', collections);

  const onConfirm = () => {
    setIsCreating(true);
    /*
     setSsCreatingCollection(true);

    const createResp = await createCollection(collectionFull);

    if (!createResp?.signerPayloadJSON) {
      error('Create collection error', {
        name: 'Create collection',
        size: 32,
        color: 'white',
      });

      setSsCreatingCollection(false);

      return;
    }

    const signature = await signMessage(createResp.signerPayloadJSON, selectedAccount);

    await submitExtrinsic({
      signerPayloadJSON: createResp.signerPayloadJSON,
      signature,
    });

    info('Collection successfully created', {
      name: 'Create collection',
      size: 32,
      color: 'white',
    });

    setSsCreatingCollection(false);
     */
  };

  const onConfirmAndCreateMore = () => {
    onConfirm();
  };

  // TODO - add redirect to main page here if user has no collections
  if (!collections?.length && !collectionsLoading) {
    return null;
  }

  // TODO - add some loader here
  if (collectionsLoading) {
    return null;
  }

  return (
    <>
      <Heading size="1">Create a NFT</Heading>
      <MainWrapper className={classNames('create-nft-page', className)}>
        <WrapperContent>
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
                        <Avatar
                          size={24}
                          src={tokenImg ? URL.createObjectURL(tokenImg) : ''}
                          type="circle"
                        />
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
                <Upload type="square" onChange={setImage} />
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
                disabled={false}
                title="Confirm and create more"
                role="primary"
                onClick={onConfirm}
              />
              <Button
                disabled={false}
                title="Confirm and close"
                onClick={onConfirmAndCreateMore}
              />
            </ButtonGroup>
          </Form>
        </WrapperContent>
        <Sidebar collectionId={selectedCollection?.id} />
      </MainWrapper>
    </>
  );
};
