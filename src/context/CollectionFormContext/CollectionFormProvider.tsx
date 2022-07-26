import { ReactNode, useState } from 'react';

import { CreateCollectionFormType } from '@app/pages/CreateCollection/pages';

import CollectionFormContext from './CollectionFormContext';

export const CollectionFormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CreateCollectionFormType | null>(null);
  return (
    <CollectionFormContext.Provider
      value={{
        data,
        setCollectionFormData: setData,
      }}
    >
      {children}
    </CollectionFormContext.Provider>
  );
};
