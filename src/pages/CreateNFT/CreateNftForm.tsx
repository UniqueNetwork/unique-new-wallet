import { VFC } from 'react';
import classNames from 'classnames';
import {
  Avatar,
  Heading,
  Suggest,
  Text,
  Upload,
  useNotifications,
} from '@unique-nft/ui-kit';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

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
import { UploadController } from '@app/components/FormControllerComponents';

import { AttributeType, Option, TokenForm } from './types';
import { AttributesRow } from './AttributesRow';

interface CreateNftFormProps {
  collectionsOptions: Option[];
  collectionsOptionsLoading: boolean;
  selectedCollection?: CollectionInfoWithSchemaResponse;
}

export const CreateNftForm: VFC<CreateNftFormProps> = ({
  collectionsOptions,
  collectionsOptionsLoading,
  selectedCollection,
}) => {
  const { error } = useNotifications();
  const { uploadFile, isLoading: isLoadingFileUpload } = useFileUpload();

  const { control, setValue, reset } = useFormContext();
  const tokenFormValues = useWatch<TokenForm>({ control: control as any });

  const uploadCover = async (
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
  };

  console.log(selectedCollection?.schema?.attributesSchema);

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
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
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
                            type="circle"
                            src={suggestion.img || undefined}
                          />
                          {suggestion?.title} [id {suggestion?.id}]
                        </SuggestOption>
                      );
                    },
                  }}
                  value={value}
                  suggestions={collectionsOptions}
                  isLoading={collectionsOptionsLoading}
                  getActiveSuggestOption={(option: Option, activeOption: Option) =>
                    option.id === activeOption.id
                  }
                  getSuggestionValue={({ title }: Option) => title}
                  onChange={(val) => {
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
                render={({ field: { onChange } }) => (
                  <Upload
                    type="square"
                    upload={getTokenIpfsUriByImagePath(
                      tokenFormValues?.imageIpfsCid || null,
                    )}
                    onChange={(data) => uploadCover(data, onChange)}
                  />
                )}
              />
            </UploadWidget>
          </FormRow>
          <Heading size="3">Attributes</Heading>
          {Object.values(selectedCollection?.schema?.attributesSchema ?? []).map(
            (attr, index) => {
              const values = Object.values(attr.enumValues ?? []).map((val) => val._);

              console.log(values);

              let type: AttributeType = 'text';

              if (attr.enumValues) {
                type = attr.isArray ? 'multiselect' : 'select';
              }

              return (
                <AttributesRow
                  key={`${index}${attr.name}`}
                  name={`attributes.${index}`}
                  label={attr.name._}
                  required={!attr.optional}
                  type={type}
                  values={values}
                />
              );
            },
          )}
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
