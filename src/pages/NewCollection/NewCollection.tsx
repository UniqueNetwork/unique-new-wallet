import { Heading } from '@unique-nft/ui-kit';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { CollectionSidebar } from './components/CollectionSidebar';
import './styles.scss';
import MainInformation from './pages/MainInformation';
import { useFormik } from 'formik';
import NftAttributes from './pages/NftAttributes';
import { useEffect } from 'react';

export const MAIN_INFORMATION_DEFAULT_VALUES = {
  name: '',
  description: '',
  symbol: '',
  file: null
};

export type MainInformationValues = typeof MAIN_INFORMATION_DEFAULT_VALUES;

export const NewCollection = () => {
  const navigate = useNavigate();

  const mainInformationForm = useFormik({
    initialValues: MAIN_INFORMATION_DEFAULT_VALUES,
    validate: (values) => {
      const errors: Partial<MainInformationValues> = {};
      if (values.name.length === 0) {
        errors.name = 'Field required';
      }
      if (values.symbol.length === 0) {
        errors.symbol = 'Field required';
      }
      return errors;
    },
    validateOnBlur: true,
    onSubmit: () => {
      navigate('/new-collection/nft-attributes');
    }
  });

  useEffect(() => {
    // navigate('/new-collection/main-information', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Heading>Create a collection</Heading>
      <div className={'collection-template'}>
        <div className={'collection-content-page'}>
          <div className={'collection-content'}>
            <Routes>
              <Route
                element={<MainInformation formik={mainInformationForm} />}
                path={'main-information'}
              />
              <Route element={<NftAttributes />} path={'nft-attributes'} />
            </Routes>
          </div>
        </div>
        <div className={'collection-sidebar'}>
          <CollectionSidebar
            mainInformationValue={mainInformationForm.values}
          />
        </div>
      </div>
    </div>
  );
};
