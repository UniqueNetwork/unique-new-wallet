import { useEffect, useMemo, createContext, useContext } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

import { useCollectionCreate } from '@app/api';

import { CollectionForm } from '../types';
import { mapCollectionForm } from '../helpers';

export interface FeeContextProps {
  fee: string;
  feeFormatted: string;
  feeLoading: boolean;
  feeError: string | null;
}

export const FeeContext = createContext<FeeContextProps | null>(null);

export const FeeProvider = ({ children }: any) => {
  const { getFee, fee, feeError, feeLoading, feeFormatted } = useCollectionCreate();
  const { control } = useFormContext<CollectionForm>();
  const collectionFormValues = useWatch<CollectionForm>({
    control,
  });
  const debounced = useDebouncedCallback(() => {
    if (collectionFormValues) {
      const collection = mapCollectionForm(collectionFormValues as CollectionForm);
      getFee(collection);
    }
  }, 500);

  useEffect(() => debounced(), [collectionFormValues]);

  const value = useMemo(
    () => ({ fee, feeFormatted, feeLoading, feeError }),
    [fee, feeFormatted, feeLoading, feeError],
  );

  return <FeeContext.Provider value={value}>{children}</FeeContext.Provider>;
};

export const useFeeContext = () => {
  const context = useContext(FeeContext);

  if (!context) {
    throw Error(
      'FeeContext context value was not provided. Make sure FeeContext context exists!',
    );
  }

  return context;
};
