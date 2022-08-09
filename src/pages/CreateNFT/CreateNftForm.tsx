import { FC, useEffect, useMemo, memo, VFC, useCallback } from 'react';
import classNames from 'classnames';
import {
  Avatar,
  Heading,
  Suggest,
  Text,
  Upload,
  useNotifications,
} from '@unique-nft/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';

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
import { useFileUpload } from '@app/api';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { CollectionInfoWithSchemaResponse } from '@app/types/Api';

import { AttributeType, Option } from './types';
import { AttributesRow } from './AttributesRow';

interface CreateNftFormProps {
  collectionsOptions: Option[];
  collectionsOptionsLoading: boolean;
  selectedCollection?: CollectionInfoWithSchemaResponse;
}

interface AttributesProps {
  name: string;
  label?: string;
  required?: boolean;
  type: AttributeType;
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
      {suggestion.title} [id {suggestion.id}]
    </SuggestOption>
  );
};

export const CreateNftForm: VFC<CreateNftFormProps> = ({
  collectionsOptions,
  collectionsOptionsLoading,
  selectedCollection,
}) => {
  const { error } = useNotifications();
  const { uploadFile, isLoading: isLoadingFileUpload } = useFileUpload();

  const { resetField } = useFormContext();

  const attributes = useMemo(
    () => Object.values(selectedCollection?.schema?.attributesSchema ?? []),
    [selectedCollection],
  );

  const uploadCover = useCallback(
    async (
      data: { url: string; file: Blob } | null,
      callbackFn: (cid: string) => void,
    ) => {
      if (!data?.file) {
        callbackFn('');
        return;
      }
      const _10MB = 10000000;
      if (data.file.size > _10MB) {
        error('File size more 10MB');
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
      <FormBody>
        <Form>
          <FormRow>
            <LabelText>Collection*</LabelText>
            <Controller
              name="collectionId"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Suggest
                  components={{
                    SuggestItem: CollectionSuggestion,
                  }}
                  suggestions={collectionsOptions}
                  isLoading={collectionsOptionsLoading}
                  value={collectionsOptions.find((co) => co.id === value)}
                  getActiveSuggestOption={(option: Option) => {
                    console.log(value);
                    return option.id === (value as number);
                  }}
                  getSuggestionValue={({ title }: Option) => title}
                  onChange={(val) => {
                    resetField('attributes');
                    resetField('imageIpfsCid');

                    onChange(val?.id);
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
                  <Upload
                    type="square"
                    upload={getTokenIpfsUriByImagePath(value || null)}
                    onChange={(data) => uploadCover(data, onChange)}
                  />
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
