import React, { FC, useEffect, useState } from 'react';
import { Heading, Loader, Text, useNotifications } from '@unique-nft/ui-kit';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { useAccounts } from '@app/hooks';
import { CollectionApiService, useExtrinsicFee, useFileUpload } from '@app/api';
import { Alert, CollectionStepper, Confirm, MintingBtn } from '@app/components';
import {
  AdditionalText,
  ButtonGroup,
  Form,
  FormBody,
  FormHeader,
  FormRow,
  FormWrapper,
  LabelText,
  UploadWidget,
} from '@app/pages/components/FormComponents';
import { CreateCollectionNewRequest } from '@app/types/Api';
import { useCollectionFormContext } from '@app/context/CollectionFormContext/useCollectionFormContext';
import { CREATE_COLLECTION_TABS_ROUTE, ROUTE } from '@app/routes';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import {
  InputController,
  TextareaController,
  UploadController,
} from '@app/components/FormControllerComponents';

type RequiredSchemaCollectionType = Pick<
  CreateCollectionNewRequest['schema'],
  | 'schemaName'
  | 'schemaVersion'
  | 'attributesSchemaVersion'
  | 'image'
  | 'attributesSchema'
> & {
  coverPicture?: { ipfsCid: string };
};

export type CreateCollectionFormType = Pick<
  CreateCollectionNewRequest,
  'address' | 'name' | 'description' | 'tokenPrefix'
> & { schema?: RequiredSchemaCollectionType };

export const MainInformation: FC = () => {
  // const navigate = useNavigate();
  // const { selectedAccount } = useAccounts();
  const { goToStep } = useOutletContext<any>();
  // const { data, setCollectionFormData } = useCollectionFormContext();

  // const collectionForm = useForm<CreateCollectionFormType>({
  //   mode: 'onChange',
  //   reValidateMode: 'onChange',
  //   defaultValues: data || {
  //     address: selectedAccount?.address,
  //     name: '',
  //     description: '',
  //     tokenPrefix: '',
  //     schema: {
  //       coverPicture: {
  //         ipfsCid: '',
  //       },
  //       attributesSchema: {},
  //       attributesSchemaVersion: '1.0.0',
  //       image: {
  //         urlTemplate: 'string{infix}.ext',
  //       },
  //       schemaName: 'unique',
  //       schemaVersion: '1.0.0',
  //     },
  //   },
  // });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
    getValues,
  } = useFormContext<CreateCollectionFormType>();

  console.log(getValues());

  const collectionFormValues = useWatch({
    control,
  }) as CreateCollectionFormType;

  // const [collectionDebounceValue] = useDebounce(collectionFormValues, 500);

  const { error } = useNotifications();
  // const { feeError, isFeeError, feeFormatted, getFee } = useExtrinsicFee(
  //   CollectionApiService.collectionCreateMutation,
  // );
  const { uploadFile, isLoading: isLoadingFileUpload } = useFileUpload();
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);

  const uploadCover = async (file: { url: string; file: Blob }) => {
    const response = await uploadFile(file.file);

    response && setValue('schema.coverPicture.ipfsCid', response.cid);
  };

  // useEffect(() => {
  //   console.log(collectionDebounceValue);
  //   // if (!collectionDebounceValue) {
  //   //   return;
  //   // }
  //   // getFee({
  //   //   collection: collectionDebounceValue,
  //   // });
  // }, [collectionDebounceValue]);

  // useEffect(() => {
  //   setCollectionFormData(collectionFormValues);
  // }, [collectionFormValues, setCollectionFormData]);

  const setCover = (data: { url: string; file: Blob } | null) => {
    if (!data?.file) {
      setValue('schema.coverPicture.ipfsCid', '');
      return;
    }
    const _10MB = 10000000;
    if (data.file.size > _10MB) {
      error('File size more 10MB');
      return;
    }

    uploadCover(data);
  };

  // useEffect(() => {
  //   if (!isFeeError) {
  //     return;
  //   }
  //   error(feeError?.message);
  // }, [feeError?.message, isFeeError]);

  return (
    <>
      <FormWrapper>
        <CollectionStepper activeStep={1} />
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
                label="Description"
                additionalText="Max 256 symbols"
                rows={4}
                name="description"
                maxLength={256}
              />
            </FormRow>
            <FormRow>
              <InputController
                name="tokenPrefix"
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
                    name="schema.coverPicture.ipfsCid"
                    upload={getTokenIpfsUriByImagePath(
                      // collectionFormValues?.schema?.coverPicture?.ipfsCid ||
                      null,
                    )}
                    onChange={setCover}
                  />
                </UploadWidget>
                {isLoadingFileUpload && <Loader label="Download image..." />}
              </DownloadCover>
            </FormRow>

            {/* {feeFormatted && (
              <Alert type="warning">
                A fee of ~ {feeFormatted} can be applied to the transaction
              </Alert>
            )} */}
            {/* <ButtonGroup>
              <MintingBtn
                disabled={isLoadingFileUpload || !isValid}
                iconRight={{
                  color: 'currentColor',
                  name: 'arrow-right',
                  size: 12,
                }}
                title="Next step"
                onClick={handleSubmit(onSubmit)}
              />
            </ButtonGroup> */}
          </Form>
        </FormBody>
      </FormWrapper>
    </>
  );
};

const DownloadCover = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;
