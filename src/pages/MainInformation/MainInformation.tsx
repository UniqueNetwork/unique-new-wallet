import {VFC, useContext, useCallback} from 'react';
import classNames from 'classnames';
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

  const setName = useCallback((value: string) => {
    if (value.length > 64) {
      return;
    }
    setFieldValue('name', value);
  }, [setFieldValue]);

  const setDescription = useCallback((value: string) => {
    if (value.length > 256) {
      return;
    }
    setFieldValue('description', value);
  }, [setFieldValue]);

  const setTokenPrefix = useCallback((value: string) => {
    if (value.length > 4) {
      return;
    }
    setFieldValue('tokenPrefix', value);
  }, [setFieldValue]);

  const setFile = useCallback((_: string, file: Blob) => {
    setFieldValue('file', file);
  }, [setFieldValue]);

  return (
    <div className={classNames('main-information', className)}>
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
            label='Name*'
            additionalText='Max 64 symbols'
            name='name'
            onChange={setName}
            value={values.name}
            error={touched.name && Boolean(errors.name)}
            statusText={touched.name ? errors.name : undefined}
          />
          <Textarea
            label='Description'
            additionalText='Max 256 symbols'
            name='description'
            rows={4}
            onChange={setDescription}
            value={mainInformationForm.values.description}
          />
          <InputText
            label='Symbol*'
            additionalText={'Token name as displayed in Wallet (max 4 symbols)'}
            name='symbol'
            onChange={setTokenPrefix}
            value={mainInformationForm.values.tokenPrefix}
            error={touched.tokenPrefix && Boolean(mainInformationForm.errors.tokenPrefix)}
            statusText={touched.tokenPrefix ? mainInformationForm.errors.tokenPrefix : undefined}
          />
          <div className='unique-input-text'>
            <label>Upload image</label>
            <div className='additional-text'>
              Choose JPG, PNG, GIF (max 10 Mb)
            </div>
            <Upload
              upload={uploadImg}
              onChange={setFile}
            />
          </div>
          <Alert type='warning' className='alert-wrapper'>
            A fee of ~ 2.073447 QTZ can be applied to the transaction
          </Alert>
          <div className='main-information-button'>
            <Button
              iconRight={{
                color: 'var(--color-primary-400)',
                name: 'arrow-right',
                size: 12
              }}
              title='Next step'
              type='submit'
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
