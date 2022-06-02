import { VFC, useContext, useCallback } from 'react';
import classNames from 'classnames';
import { Heading, InputText, Button, Textarea, Text, Upload } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { CollectionFormContext } from '@app/context';
import { Alert, CollectionStepper } from '@app/components';
import { MainInformationInitialValues } from '@app/types';

export interface MainInformationComponentProps {
  className?: string;
}

const MainInformationComponent: VFC<MainInformationComponentProps> = ({ className }) => {
  const { mainInformationForm } = useContext(CollectionFormContext);

  const { handleSubmit, setFieldValue, values, errors, touched } = mainInformationForm;

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

  const setFile = useCallback(
    (data: MainInformationInitialValues['file']) => {
      setFieldValue('file', data);
    },
    [setFieldValue],
  );

  return (
    <div className={classNames('main-information', className)}>
      <CollectionStepper activeStep={1} />
      <Heading size="2">Main information</Heading>
      <Text>
        Fill fields carefully, because after signing the transaction, the data cannot be
        changed. If you make a mistake, the object will have to be burned and recreated.
      </Text>
      <div>
        <form onSubmit={handleSubmit}>
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
            <Upload onChange={setFile} />
          </div>
          <Alert type="warning" className="alert-wrapper">
            A fee of ~ 2.073447 QTZ can be applied to the transaction
          </Alert>
          <div className="main-information-button">
            <Button
              iconRight={{
                color: 'var(--color-primary-400)',
                name: 'arrow-right',
                size: 12,
              }}
              title="Next step"
              type="submit"
            />
          </div>
        </form>
      </div>
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
