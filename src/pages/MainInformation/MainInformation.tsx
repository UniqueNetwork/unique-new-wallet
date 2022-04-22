import { VFC, useContext } from 'react';
import {
  Heading,
  InputText,
  Button,
  Textarea,
  Text,
  Upload
} from '@unique-nft/ui-kit';
import { CollectionFormContext } from '@app/context';
import styled from 'styled-components';
import uploadImg from '@app/static/icons/upload.svg';

import { Alert, CollectionStepper } from '@app/components';

export interface MainInformationComponentProps {
  className?: string;
}

const MainInformationComponent: VFC<MainInformationComponentProps> = ({ className }) => {
  const { mainInformationForm } = useContext(CollectionFormContext);
  const { handleSubmit, setFieldValue, values, errors, touched } = mainInformationForm;

  return (
    <div className={className}>
      <CollectionStepper activeStep={1} />
      <Heading size={'2'}>Main information</Heading>
      <Text>
        Заполняйте данные внимательно, потому что после подписания транзакции
        нельзя вносить изменения. Если допустите ошибку, коллекцию придется
        сжечь и создать заново.
      </Text>
      <div>
        <form onSubmit={handleSubmit}>
          <InputText
            label={'Name*'}
            additionalText={'Max 64 symbols'}
            name={'name'}
            onChange={(value) => {
              if (value.length > 64) {
                return;
              }
              setFieldValue('name', value);
            }}
            value={values.name}
            error={touched.name && Boolean(errors.name)}
            statusText={touched.name ? errors.name : undefined}
          />
          <Textarea
            label={'Description'}
            additionalText={'Max 256 symbols'}
            name={'description'}
            rows={4}
            onChange={(value) => {
              if (value.length > 256) {
                return;
              }
              mainInformationForm.setFieldValue('description', value);
            }}
            value={mainInformationForm.values.description}
          />
          <InputText
            label={'Symbol*'}
            additionalText={'Token name as displayed in Wallet (max 4 symbols)'}
            name={'symbol'}
            onChange={(value) => {
              if (value.length > 4) {
                return;
              }
              mainInformationForm.setFieldValue('tokenPrefix', value);
            }}
            value={mainInformationForm.values.tokenPrefix}
            error={touched.tokenPrefix && Boolean(mainInformationForm.errors.tokenPrefix)}
            statusText={touched.tokenPrefix ? mainInformationForm.errors.tokenPrefix : undefined}
          />
          <div className={'unique-input-text'}>
            <label>Upload image</label>
            <div className={'additional-text'}>
              Choose JPG, PNG, GIF (max 10 Mb)
            </div>
            <Upload
              upload={uploadImg}
              onChange={(_, file) => {
                mainInformationForm.setFieldValue('file', file);
              }}
            />
          </div>
          <Alert type={'warning'} className={'alert-wrapper'}>
            A fee of ~ 2.073447 QTZ can be applied to the transaction
          </Alert>
          <div className={'main-information-button'}>
            <Button
              title={'Exit'}
              iconLeft={{
                color: 'var(--color-primary-400)',
                name: 'arrow-left',
                size: 12
              }}
              className={'exit'}
            />
            <Button
              title={'Next step'}
              type={'submit'}
              iconRight={{
                color: 'var(--color-primary-400)',
                name: 'arrow-right',
                size: 12
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export const MainInformation = styled(MainInformationComponent)`
  display: flex;
  margin-top: 25px;

  .exit {
    margin-right: 15px;
  }
`;
