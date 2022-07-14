import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import {
  Heading,
  InputText,
  Text,
  Textarea,
  Upload,
  useNotifications,
} from '@unique-nft/ui-kit';

import { useAccounts } from '@app/hooks';
import { CollectionFormContext } from '@app/context';
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

export const MainInformation: FC = () => {
  const { selectedAccount } = useAccounts();
  const { error } = useNotifications();
  const { mainInformationForm, setCoverImgFile, mapFormToCollectionDto } =
    useContext(CollectionFormContext);
  const {
    isError: isFeeError,
    error: feeError,
    feeFormatted,
    getFee,
  } = useExtrinsicFee(CollectionApiService.collectionCreateMutation);
  const { uploadFile } = useFileUpload();
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);

  const { dirty, submitForm, isValid, setFieldValue, values, errors, touched } =
    mainInformationForm;

  const setName = useCallback(
    (value: string) => {
      if (value.length > 64) {
        return;
      }
      setFieldValue('name', value);
    },
    [setFieldValue],
  );

  const setDescription = useCallback(
    (value: string) => {
      if (value.length > 256) {
        return;
      }
      setFieldValue('description', value);
    },
    [setFieldValue],
  );

  const setTokenPrefix = useCallback(
    (value: string) => {
      if (value.length > 4) {
        return;
      }
      setFieldValue('tokenPrefix', value);
    },
    [setFieldValue],
  );

  const uploadCover = async (file: Blob) => {
    const response = await uploadFile(file);

    setFieldValue('coverImgAddress', response?.cid);

    getFee({ collection: mapFormToCollectionDto(selectedAccount?.address || '') });
  };

  const setCover = (data: { url: string; file: Blob } | null) => {
    if (!data?.file) {
      return;
    }

    const file: Blob = data?.file;

    setCoverImgFile(file);

    void uploadCover(file);
  };

  const onFormSubmit = () => {
    if (!values.coverImgAddress) {
      setIsOpenConfirm(true);
    } else {
      void submitForm();
    }
  };

  const onClickStep = (step: number) => {
    if (!dirty || !isValid) {
      return;
    }

    if (step === 2) {
      onFormSubmit();
    }
  };

  useEffect(() => {
    if (isFeeError) {
      error(feeError?.message);
    }
  }, [isFeeError]);

  useEffect(() => {
    getFee({ collection: mapFormToCollectionDto(selectedAccount?.address || '') });
  }, [values]);

  return (
    <>
      <FormWrapper>
        <CollectionStepper activeStep={1} onClickStep={onClickStep} />
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
              <InputText
                label="Name*"
                additionalText="Max 64 symbols"
                name="name"
                value={values.name}
                error={touched.name && Boolean(errors.name)}
                statusText={touched.name ? errors.name : undefined}
                onChange={setName}
              />
            </FormRow>
            <FormRow>
              <Textarea
                label="Description"
                additionalText="Max 256 symbols"
                name="description"
                rows={4}
                value={mainInformationForm.values.description}
                onChange={setDescription}
              />
            </FormRow>
            <FormRow>
              <InputText
                label="Symbol*"
                additionalText="Token name as displayed in Wallet (max 4 symbols)"
                name="symbol"
                value={mainInformationForm.values.tokenPrefix}
                error={
                  touched.tokenPrefix && Boolean(mainInformationForm.errors.tokenPrefix)
                }
                statusText={
                  touched.tokenPrefix ? mainInformationForm.errors.tokenPrefix : undefined
                }
                onChange={setTokenPrefix}
              />
            </FormRow>
            <FormRow className="has_uploader">
              <UploadWidget>
                <LabelText>Upload image</LabelText>
                <AdditionalText>Choose JPG, PNG, GIF (max 10 Mb)</AdditionalText>
                <Upload
                  // TODO - fix file preload, file clearing
                  // upload={coverImgFile ? URL.createObjectURL(coverImgFile) : undefined}
                  onChange={setCover}
                />
              </UploadWidget>
            </FormRow>
            {feeFormatted && (
              <Alert type="warning">
                A fee of ~ {feeFormatted} can be applied to the transaction
              </Alert>
            )}
            <ButtonGroup>
              <MintingBtn
                disabled={!dirty || !isValid}
                iconRight={{
                  color: 'currentColor',
                  name: 'arrow-right',
                  size: 12,
                }}
                title="Next step"
                type="button"
                onClick={onFormSubmit}
              />
            </ButtonGroup>
          </Form>
        </FormBody>
      </FormWrapper>
      <Confirm
        buttons={[
          { title: 'No, return', onClick: () => setIsOpenConfirm(false) },
          {
            title: 'Yes, I am sure',
            role: 'primary',
            onClick: () => {
              setIsOpenConfirm(false);
              void submitForm();
            },
          },
        ]}
        isVisible={isOpenConfirm}
        title="You have not entered the cover. Are you sure that you want to create the collection without it?"
        onClose={() => setIsOpenConfirm(false)}
      >
        <Text>You cannot return to editing the cover in this product version.</Text>
      </Confirm>
    </>
  );
};
