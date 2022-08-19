import React, { FC, useCallback, useEffect } from 'react';
import {
  Heading,
  InputText,
  Text,
  Textarea,
  Upload,
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

export const MainInformation: FC = () => {
  const { error } = useNotifications();
  const { uploadFile, isLoading: isLoadingFileUpload } = useFileUpload();

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
        <Text>
          The core collection information cannot be modified once approved/signed. For any
          changes the collection will need to be burned and re-created
        </Text>
      </FormHeader>
      <FormBody>
        <Form>
          <FormRow>
            <Controller
              name="name"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <InputText
                  label="Name*"
                  maxLength={64}
                  value={value}
                  additionalText="Max 64 symbols"
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
                  rows={4}
                  maxLength={256}
                  additionalText="Max 256 symbols"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormRow>
          <FormRow>
            <Controller
              name="symbol"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <InputText
                  label="Symbol*"
                  additionalText="Token name as displayed in Wallet (max 4 symbols)"
                  maxLength={4}
                  value={value}
                  onChange={onChange}
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
                    <Upload
                      type="circle"
                      upload={getTokenIpfsUriByImagePath(value)}
                      onChange={(data) => uploadCover(data, onChange)}
                    />
                  )}
                />
              </UploadWidget>
              {/* {isLoadingFileUpload && <Loader label="Download image..." />} */}
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
