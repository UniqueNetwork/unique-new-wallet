import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Heading, InputText, Text, Textarea, Upload } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { useAccounts } from '@app/hooks';
import { CollectionFormContext } from '@app/context';
import { CollectionApiService, useFileUpload } from '@app/api';
import { Alert, CollectionStepper, Confirm } from '@app/components';
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
import { useApiExtrinsicFee } from '@app/api/restApi/hooks/useApiExtrinsicFee';

const MainInformationComponent: FC = () => {
  const { selectedAccount } = useAccounts();
  const { mainInformationForm, setCoverImgFile, mapFormToCollectionDto } =
    useContext(CollectionFormContext);
  const { fee, getFee } = useApiExtrinsicFee(
    CollectionApiService.collectionCreateMutation,
  );
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

  // !Only for values!
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
            Fill fields carefully, because after signing the transaction, the data cannot
            be changed. If you make a mistake, the object will have to be burned and
            recreated.
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
            <Alert type="warning" className="alert-wrapper">
              A fee of ~ {fee} can be applied to the transaction
            </Alert>
            <ButtonGroup>
              <Button
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

export const MainInformation = styled(MainInformationComponent)`
  .main-information-button {
    display: flex;
    margin-top: 25px;
    .exit {
      margin-right: 15px;
    }
  }

  .alert-wrapper {
    margin-top: 40px;
  }
`;
