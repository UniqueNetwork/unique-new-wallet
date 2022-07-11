import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  VFC,
} from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import {
  Avatar,
  Button,
  Heading,
  Suggest,
  Text,
  Upload,
  useNotifications,
} from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { Alert, StatusTransactionModal } from '@app/components';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import {
  Collection,
  TokenApiService,
  useFileUpload,
  useExtrinsicFlow,
  useExtrinsicFee,
} from '@app/api';
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
  const [closable, setClosable] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Option | null>(null);

  const navigate = useNavigate();
  const { uploadFile } = useFileUpload();
  const { selectedAccount } = useAccounts();
  const { error, info } = useNotifications();
  const { initializeTokenForm, setTokenImg, tokenForm, mapFormToTokenDto } =
    useContext(TokenFormContext);

  // TODO - use searchOnType here
  const { collections, isCollectionsLoading } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: defaultOptions,
  });

  const { data: collection } = useCollectionQuery(selectedCollection?.id ?? 0);

  const {
    getFee,
    fee,
    error: feeError,
    isError: isFeeError,
  } = useExtrinsicFee(TokenApiService.tokenCreateMutation);
  const {
    signAndSubmitExtrinsic,
    status,
    error: errorMessage,
    isLoading,
  } = useExtrinsicFlow(TokenApiService.tokenCreateMutation);
  const { dirty, isValid, setFieldValue, submitForm, values } = tokenForm;

  const collectionsOptions = useMemo(
    () =>
      collections?.map<Option>((collection: Collection) => ({
        id: collection.collection_id,
        title: collection.name,
        description: collection.description,
        img: getTokenIpfsUriByImagePath(collection.collection_cover),
      })) ?? [],
    [collections],
  );

  const tokenFields = get(collection, 'properties.fields', []);

  useEffect(() => {
    if (tokenFields?.length) {
      initializeTokenForm(tokenFields);
    }
  }, [tokenFields]);

  useEffect(() => {
    if (!selectedCollection || !selectedAccount) {
      return;
    }

    const tokenDTO = mapFormToTokenDto(selectedCollection.id, selectedAccount?.address);
    if (!tokenDTO) {
      return;
    }

    getFee({ token: tokenDTO });
  }, [values]);

  useEffect(() => {
    if (status === 'success') {
      info('Collection created successfully');

      closable && navigate(ROUTE.MY_TOKENS);
    }

    if (status === 'error') {
      error(errorMessage?.message);
    }
  }, [status]);

  useEffect(() => {
    if (isFeeError) {
      error(feeError?.message);
    }
  }, [isFeeError]);

  const uploadImage = async (file: Blob) => {
    const response = await uploadFile(file);

    setFieldValue('ipfsJson', JSON.stringify({ ipfs: response?.cid, type: 'image' }));
  };

  const setImage = useCallback((data: { url: string; file: Blob } | null) => {
    if (data?.file) {
      const file: Blob = data?.file;

      setTokenImg(file);

      void uploadImage(file);
    }
  }, []);

  const confirmFormHandler = (closable?: boolean) => {
    if (!selectedCollection) {
      error('Collection is not chosen');

      return;
    }
    if (!selectedAccount) {
      error('Account is not found');

      return;
    }

    const tokenDTO = mapFormToTokenDto(selectedCollection.id, selectedAccount?.address);
    if (!tokenDTO) {
      error('Token wasnt formed');

      return;
    }

    setClosable(!!closable);

    submitForm().then(() =>
      signAndSubmitExtrinsic({
        token: tokenDTO,
      }),
    );
  };

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
                    isLoading={isCollectionsLoading}
                    suggestions={collectionsOptions}
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
                    role="primary"
                    title="Confirm and create more"
                    disabled={!selectedCollection?.id || disabled}
                    onClick={() => confirmFormHandler()}
                  />
                  <Button
                    title="Confirm and close"
                    disabled={!selectedCollection?.id || disabled}
                    onClick={() => confirmFormHandler(true)}
                  />
                </ButtonGroup>
              </Form>
            </FormBody>
          </FormWrapper>
        </WrapperContent>
        <Sidebar collectionId={selectedCollection?.id} />
      </MainWrapper>
      <StatusTransactionModal isVisible={isLoading} description="Creating NFT" />
    </>
  );
};
