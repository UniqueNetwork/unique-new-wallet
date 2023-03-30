import React, { VFC, useCallback } from 'react';
import {
  Heading,
  Text,
  Textarea,
  Upload,
  Loader,
  useNotifications,
} from '@unique-nft/ui-kit';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';

import { useFileUpload } from '@app/api';
import {
  AdditionalText,
  Form,
  FormBody,
  FormHeader,
  FormRow,
  LabelText,
  UploadWidget,
} from '@app/pages/components/FormComponents';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import {
  _10MB,
  MAX_NAME_SIZE,
  MAX_SYMBOL_SIZE,
  MAX_DESCRIPTION_SIZE,
  MAX_SYMBOL_BYTES_SIZE,
  FILE_SIZE_LIMIT_ERROR,
  FORM_ERRORS,
} from '@app/pages';
import { InputText } from '@app/components';

interface MainInformationProps {
  className?: string;
}

const MainInformationComponent: VFC<MainInformationProps> = ({ className }) => {
  const { error } = useNotifications();
  const { uploadFile, isLoading: fileIsLoading } = useFileUpload();

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
        <Text>
          The core collection information cannot be modified once approved/signed. For any
          changes the collection will need to be burned and re-created
        </Text>
      </FormHeader>
      <FormBody>
        <Form className={className}>
          <FormRow>
            <Controller
              name="name"
              rules={{
                required: {
                  value: true,
                  message: FORM_ERRORS.REQUIRED_FIELDS,
                },
                pattern: {
                  value: /^\S+.*/,
                  message: 'Name is not correct',
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputText
                  label="Name*"
                  value={value}
                  maxLength={MAX_NAME_SIZE}
                  additionalText={`Max ${MAX_NAME_SIZE} symbols (${
                    MAX_NAME_SIZE - value.length
                  } left)`}
                  error={!!error}
                  statusText={error?.message}
                  onChange={onChange}
                />
              )}
            />
          </FormRow>
          <FormRow>
            <Controller
              name="description"
              render={({ field: { onChange, value } }) => (
                <Textarea
                  label="Description"
                  value={value}
                  rows={4}
                  maxLength={MAX_DESCRIPTION_SIZE}
                  additionalText={`Max ${MAX_DESCRIPTION_SIZE} symbols (${
                    MAX_DESCRIPTION_SIZE - value.length
                  } left)`}
                  onChange={onChange}
                />
              )}
            />
          </FormRow>
          <FormRow>
            <Controller
              name="symbol"
              rules={{
                required: {
                  value: true,
                  message: FORM_ERRORS.REQUIRED_FIELDS,
                },
                pattern: {
                  value: /^\S+/,
                  message: 'Symbol is not correct',
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <SymbolInputText
                  label="Symbol*"
                  value={value}
                  maxLength={MAX_SYMBOL_SIZE}
                  additionalText={
                    <>
                      Token name as displayed in Wallet <br />
                      Max symbols {MAX_SYMBOL_SIZE} ({MAX_SYMBOL_SIZE - value.length}{' '}
                      left)
                    </>
                  }
                  error={!!error}
                  statusText={error?.message}
                  onChange={(newVal) => {
                    const size = new Blob([newVal]).size;

                    if (size <= MAX_SYMBOL_BYTES_SIZE) {
                      onChange(newVal);
                    }
                  }}
                />
              )}
            />
          </FormRow>
          <FormRow className="has_uploader">
            <DownloadCover>
              <UploadWidget>
                <LabelText>Upload image</LabelText>
                <AdditionalText>Choose JPG, PNG, GIF (max 10 Mb)</AdditionalText>
                <Controller
                  name="coverPictureIpfsCid"
                  render={({ field: { onChange, value } }) => (
                    <div className="upload-container">
                      <Upload
                        type="circle"
                        upload={getTokenIpfsUriByImagePath(value)}
                        beforeUpload={beforeUploadHandler}
                        onChange={(data) => onFileChangeHandler(data, onChange)}
                      />
                      {fileIsLoading && <Loader isFullPage size="middle" />}
                    </div>
                  )}
                />
              </UploadWidget>
            </DownloadCover>
          </FormRow>
        </Form>
      </FormBody>
    </>
  );
};

const DownloadCover = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const SymbolInputText = styled(InputText)`
  .additional-text {
    height: auto;
  }
`;

export const MainInformation = styled(MainInformationComponent)`
  .upload-container {
    position: relative;
    max-width: fit-content;
  }
`;
