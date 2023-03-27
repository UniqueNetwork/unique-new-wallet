import { FC, useCallback, useMemo, VFC } from 'react';
import classNames from 'classnames';
import { Avatar, Heading, Loader, Text, useNotifications } from '@unique-nft/ui-kit';
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
import { Suggest } from '@app/components/Suggest';
import { Upload } from '@app/components';

import { AttributeType, Option } from './types';
import { AttributesRow } from './AttributesRow';
import { _10MB, FILE_SIZE_LIMIT_ERROR, FORM_ERRORS } from '../constants';

interface CreateNftFormProps {
  collectionsOptions: Option[];
  collectionsOptionsLoading: boolean;
  selectedCollection?: CollectionInfoWithSchemaResponse;
  className?: string;
}

const CollectionSuggestion: FC<{
  suggestion: Option;
  isActive?: boolean;
}> = ({ suggestion, isActive }) => {
  return (
    <SuggestOption
      className={classNames('suggestion-item', {
        isActive,
      })}
    >
      <Avatar size={24} type="circle" src={suggestion.img || undefined} />
      <span className="suggestion-item__title">
        {suggestion.title} [id {suggestion.id}]
      </span>
    </SuggestOption>
  );
};

const CreateNftFormComponent: VFC<CreateNftFormProps> = ({
  collectionsOptions,
  collectionsOptionsLoading,
  selectedCollection,
  className,
}) => {
  const { error } = useNotifications();

  const { resetField } = useFormContext();

  const { uploadFile, isLoading: fileIsLoading } = useFileUpload();

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
            <LabelText>Collection*</LabelText>
            <Controller
              name="collectionId"
              rules={{
                required: {
                  value: true,
                  message: FORM_ERRORS.REQUIRED_FIELDS,
                },
              }}
              render={({ field: { value, onChange } }) => (
                <Suggest
                  components={{
                    SuggestItem: CollectionSuggestion,
                  }}
                  suggestions={collectionsOptions}
                  isLoading={collectionsOptionsLoading}
                  value={collectionsOptions.find((co) => co.id === value)}
                  getActiveSuggestOption={(option: Option) => {
                    return option.id === (value as number);
                  }}
                  getSuggestionValue={({ title }: Option) => title}
                  onChange={(val) => {
                    resetField('attributes');
                    resetField('imageIpfsCid');
                    onChange(val?.id);
                  }}
                  onSuggestionsFetchRequested={(value) =>
                    collectionsOptions.filter(
                      ({ id, title }) =>
                        title.toLowerCase().includes(value.toLowerCase()) ||
                        id === Number(value),
                    )
                  }
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
                rules={{
                  required: {
                    value: true,
                    message: FORM_ERRORS.REQUIRED_FIELDS,
                  },
                }}
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
