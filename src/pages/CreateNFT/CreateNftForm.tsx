import { useCallback, useMemo, VFC } from 'react';
import classNames from 'classnames';
import {
  Avatar,
  Heading,
  Loader,
  Text,
  Upload,
  useNotifications,
} from '@unique-nft/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { CollectionInfoWithSchemaResponse } from '@unique-nft/sdk';

import {
  AdditionalText,
  Form,
  FormBody,
  FormHeader,
  FormRow,
  FormRowEmpty,
  LabelText,
  SuggestOption,
  UploadWidget,
} from '@app/pages/components/FormComponents';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { useFileUpload } from '@app/api';
import { Select, Option, SelectLoadOptions } from '@app/components';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';
import { useAccounts } from '@app/hooks';

import { AttributeType } from './types';
import { AttributesRow } from './AttributesRow';
import { _10MB, FILE_SIZE_LIMIT_ERROR } from '../constants';

interface CreateNftFormProps {
  selectedCollection?: CollectionInfoWithSchemaResponse;
  className?: string;
}

const OptionItem = ({ label, value, cover }: Option) => {
  return (
    <SuggestOption className={classNames('suggestion-item')}>
      <Avatar size={24} type="circle" src={cover || undefined} />
      <span className="suggestion-item__title">
        {label} [id {value}]
      </span>
    </SuggestOption>
  );
};

const CreateNftFormComponent: VFC<CreateNftFormProps> = ({
  selectedCollection,
  className,
}) => {
  const { error } = useNotifications();

  const { resetField } = useFormContext();

  const { uploadFile, isLoading: fileIsLoading } = useFileUpload();

  const defaultOptions = {
    skip: false,
    pagination: {
      page: 0,
      limit: 20,
    },
  };
  const { selectedAccount } = useAccounts();
  const { fetchMore } = useGraphQlCollectionsByAccount({
    accountAddress: selectedAccount?.address,
    options: defaultOptions,
    enabled: false,
  });

  const loadOptions: SelectLoadOptions = async (
    searchQuery,
    loadedOptions,
    additionalSettings,
  ) => {
    const { page } = additionalSettings ?? { page: 0 };
    const { collections, isPagination } = await fetchMore(page, searchQuery);

    return {
      options:
        collections?.map<Option>((c) => ({
          label: c.name,
          value: c.collection_id.toString(),
          cover: getTokenIpfsUriByImagePath(c.collection_cover),
        })) ?? [],
      hasMore: isPagination,
      additional: {
        page: isPagination ? page + 1 : 0,
      },
    };
  };

  const attributes = useMemo(
    () => Object.values(selectedCollection?.schema?.attributesSchema ?? []),
    [selectedCollection],
  );

  const beforeUploadHandler = useCallback((data: { url: string; file: Blob }) => {
    if (data.file.size > _10MB) {
      error(FILE_SIZE_LIMIT_ERROR);

      return false;
    }

    return true;
  }, []);

  const onFileChangeHandler = useCallback(
    async (
      data: { url: string; file: Blob } | null,
      callbackFn: (cid: string) => void,
    ) => {
      if (!data?.file) {
        callbackFn('');
        return;
      }

      const response = await uploadFile(data.file);

      response && callbackFn(response.cid);
    },
    [],
  );

  return (
    <>
      <FormHeader>
        <Heading size="2">Main information</Heading>
      </FormHeader>
      <FormBody className={className}>
        <Form>
          <FormRow>
            <Controller
              name="collectionId"
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Select
                  render={<OptionItem />}
                  debounceTimeout={500}
                  loadOptions={loadOptions}
                  onChange={(c) => {
                    resetField('attributes');
                    resetField('imageIpfsCid');

                    onChange(c?.value);
                  }}
                />
              )}
            />
          </FormRow>
          <FormRow className="has_uploader">
            <UploadWidget>
              <LabelText>Upload image*</LabelText>
              <AdditionalText>Choose JPG, PNG, GIF (max 10 Mb)</AdditionalText>
              <Controller
                name="imageIpfsCid"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <div className="upload-container">
                    <Upload
                      type="square"
                      upload={getTokenIpfsUriByImagePath(value)}
                      beforeUpload={beforeUploadHandler}
                      onChange={(data) => onFileChangeHandler(data, onChange)}
                    />
                    {fileIsLoading && <Loader isFullPage size="middle" />}
                  </div>
                )}
              />
            </UploadWidget>
          </FormRow>
          <Heading size="3">Attributes</Heading>
          {attributes.map((attr, index) => {
            const values = Object.values(attr.enumValues ?? []).map((val) => val._);

            let type: AttributeType = 'text';

            if (attr.enumValues) {
              type = attr.isArray ? 'multiselect' : 'select';
            }

            return (
              <AttributesRow
                key={`${selectedCollection?.id}${index}${attr.name}`}
                name={`attributes.${index}`}
                label={attr.name._}
                required={!attr.optional}
                type={type}
                values={values}
              />
            );
          })}
          {!selectedCollection && (
            <FormRowEmpty>
              <Text color="grey-500" size="s">
                Will become available after selecting a collection
              </Text>
            </FormRowEmpty>
          )}
        </Form>
      </FormBody>
    </>
  );
};

export const CreateNftForm = styled(CreateNftFormComponent)`
  margin-bottom: calc(var(--prop-gap) * 2.5);
`;
