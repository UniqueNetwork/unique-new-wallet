import React, { FC, useState } from 'react';
import { Heading, Loader, Text, useNotifications } from '@unique-nft/ui-kit';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useFileUpload } from '@app/api';
import {
  AdditionalText,
  Form,
  FormBody,
  FormHeader,
  FormRow,
  FormWrapper,
  LabelText,
  UploadWidget,
} from '@app/pages/components/FormComponents';
import { CreateCollectionNewRequest } from '@app/types/Api';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import {
  InputController,
  TextareaController,
  UploadController,
} from '@app/components/FormControllerComponents';

import { CollectionForm } from '../types';

export const MainInformation: FC = () => {
  const { setValue, control } = useFormContext<CollectionForm>();
  const collectionFormValues = useWatch({ control });

  const { error } = useNotifications();
  const { uploadFile, isLoading: isLoadingFileUpload } = useFileUpload();

  const uploadCover = async (data: { url: string; file: Blob } | null) => {
    if (!data?.file) {
      setValue('coverPictureIpfsCid', '');
      return;
    }
    const _10MB = 10000000;
    if (data.file.size > _10MB) {
      error('File size more 10MB');
      return;
    }

    const response = await uploadFile(data.file);

    response && setValue('coverPictureIpfsCid', response.cid);
  };

  return (
    <>
      <FormHeader>
        <Heading size="2">Main information</Heading>
        <Text>
          The core collection information cannot be&nbsp;modified once approved/signed.
          For any changes the collection will need to&nbsp;be&nbsp;burned and re-created
        </Text>
      </FormHeader>
      <FormBody>
        <Form>
          <FormRow>
            <InputController
              name="name"
              label="Name*"
              additionalText="Max 64 symbols"
              maxLength={64}
              rules={{
                required: true,
              }}
            />
          </FormRow>
          <FormRow>
            <TextareaController
              name="description"
              label="Description"
              additionalText="Max 256 symbols"
              maxLength={256}
              rows={4}
            />
          </FormRow>
          <FormRow>
            <InputController
              name="symbol"
              label="Symbol*"
              additionalText="Token name as displayed in Wallet (max 4 symbols)"
              rules={{
                required: true,
              }}
              maxLength={4}
            />
          </FormRow>
          <FormRow className="has_uploader">
            <DownloadCover>
              <UploadWidget>
                <LabelText>Upload image</LabelText>
                <AdditionalText>Choose JPG, PNG, GIF (max 10 Mb)</AdditionalText>
                <UploadController
                  name="coverPictureIpfsCid"
                  upload={getTokenIpfsUriByImagePath(
                    collectionFormValues?.coverPictureIpfsCid || null,
                  )}
                  onChange={uploadCover}
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
