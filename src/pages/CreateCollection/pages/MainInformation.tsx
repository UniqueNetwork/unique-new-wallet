import React, { VFC, useContext, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Heading, InputText, Button, Textarea, Text, Upload } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { CollectionFormContext } from '@app/context';
import { Alert, CollectionStepper, Confirm } from '@app/components';
import { useFileUpload } from '@app/api';

export interface MainInformationComponentProps {
  className?: string;
}

const MainInformationComponent: VFC<MainInformationComponentProps> = ({ className }) => {
  const { mainInformationForm, setCoverImgFile } = useContext(CollectionFormContext);
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

    setFieldValue('coverImgAddress', response?.address);
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

  return (
    <div className={classNames('main-information', className)}>
      <CollectionStepper activeStep={1} onClickStep={onClickStep} />
      <Heading size="2">Main information</Heading>
      <Text>
        Fill fields carefully, because after signing the transaction, the data cannot be
        changed. If you make a mistake, the object will have to be burned and recreated.
      </Text>
      <div>
        <form>
          <InputText
            label="Name*"
            additionalText="Max 64 symbols"
            name="name"
            value={values.name}
            error={touched.name && Boolean(errors.name)}
            statusText={touched.name ? errors.name : undefined}
            onChange={setName}
          />
          <Textarea
            label="Description"
            additionalText="Max 256 symbols"
            name="description"
            rows={4}
            value={mainInformationForm.values.description}
            onChange={setDescription}
          />
          <InputText
            label="Symbol*"
            additionalText="Token name as displayed in Wallet (max 4 symbols)"
            name="symbol"
            value={mainInformationForm.values.tokenPrefix}
            error={touched.tokenPrefix && Boolean(mainInformationForm.errors.tokenPrefix)}
            statusText={
              touched.tokenPrefix ? mainInformationForm.errors.tokenPrefix : undefined
            }
            onChange={setTokenPrefix}
          />
          <div className="unique-input-text">
            <label>Upload image</label>
            <div className="additional-text">Choose JPG, PNG, GIF (max 10 Mb)</div>
            <Upload
              // TODO - fix file preload, file clearing
              // upload={coverImgFile ? URL.createObjectURL(coverImgFile) : undefined}
              onChange={setCover}
            />
          </div>
          <Alert type="warning" className="alert-wrapper">
            {/* TODO - get fee from the API */}A fee of ~ 2.073447 QTZ can be applied to
            the transaction
          </Alert>
          <div className="main-information-button">
            <Button
              disabled={!dirty || !isValid}
              iconRight={{
                color: 'var(--color-primary-400)',
                name: 'arrow-right',
                size: 12,
              }}
              title="Next step"
              type="button"
              onClick={onFormSubmit}
            />
          </div>
        </form>
      </div>
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
    </div>
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
