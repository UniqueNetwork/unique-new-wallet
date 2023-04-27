import { FC, Fragment, useCallback, useEffect, useMemo, VFC } from 'react';
import classNames from 'classnames';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { CollectionInfoWithSchemaResponse } from '@unique-nft/sdk';
import { useNavigate } from 'react-router-dom';

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
import { Suggest, SuggestListProps } from '@app/components/Suggest';
import {
  Avatar,
  Heading,
  Loader,
  Typography,
  Upload,
  useNotifications,
} from '@app/components';
import { useAccounts, useApi } from '@app/hooks';
import { ROUTE } from '@app/routes';

import { Button } from '../../components/Button';
import { AttributeType, Option } from './types';
import { AttributesRow } from './AttributesRow';
import {
  _10MB,
  FILE_SIZE_LIMIT_ERROR,
  FORM_ERRORS,
  FILE_FORMAT_ERROR,
} from '../constants';

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
  const { selectedAccount } = useAccounts();
  const navigate = useNavigate();
  const { currentChain } = useApi();
  const { error } = useNotifications();

  const { resetField, setValue } = useFormContext();

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

    if (!/.*\.(jpeg|jpg|gif|png)$/.test((data.file as File).name)) {
      error(FILE_FORMAT_ERROR);

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

  const onCreateCollectionClick = () => {
    navigate(`/${currentChain.network}/${ROUTE.CREATE_COLLECTION}/`, {
      state: {
        returnToCreateToken: true,
      },
    });
  };

  const CollctionsSuggestionList: FC<SuggestListProps<Option>> = ({
    suggestions,
    children,
  }) => {
    return (
      <>
        <CreateCollectionOption
          role="ghost"
          title={<Typography color="primary-500">Create collection</Typography>}
          iconLeft={{ name: 'plus', size: 16, color: 'var(--color-primary-500)' }}
          onClick={onCreateCollectionClick}
        />
        {suggestions.map((suggest, idx) => (
          <Fragment key={idx}>
            {children(suggest, idx === suggestions.length - 1)}
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <FormHeader>
        <Heading size="2">Main information</Heading>
      </FormHeader>
      <FormBody className={className}>
        <Form>
          <FormRow>
            <LabelText>Collection*</LabelText>
            {collectionsOptions.length === 0 && (
              <CreateCollectionButton
                role="ghost"
                title={<Typography color="primary-500">Create collection</Typography>}
                iconLeft={{ name: 'plus', size: 16, color: 'var(--color-primary-500)' }}
                onClick={onCreateCollectionClick}
              />
            )}
            {collectionsOptions.length !== 0 && (
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
                      SuggestList: CollctionsSuggestionList,
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
                      onChange(val?.id);
                    }}
                    onSuggestionsFetchRequested={(value) =>
                      collectionsOptions.filter(
                        ({ id, title }) =>
                          title.toLowerCase().includes(value.toLowerCase()) ||
                          id.toString().includes(value),
                      )
                    }
                  />
                )}
              />
            )}
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
          {selectedCollection && (!attributes || !attributes.length) && (
            <Typography color="grey-500" size="s">
              There are no attributes for this collection
            </Typography>
          )}
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
              <Typography color="grey-500" size="s">
                Will become available after selecting a collection
              </Typography>
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

const CreateCollectionButton = styled(Button)`
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const CreateCollectionOption = styled(Button)`
  padding-left: calc(var(--prop-gap) / 2) !important;
`;
