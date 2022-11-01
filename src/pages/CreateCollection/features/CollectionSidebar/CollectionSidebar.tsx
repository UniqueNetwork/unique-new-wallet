import { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { CollectionForm } from '../../types';
import { CollectionSidebar as CollectionSidebarComponent } from '../../components';

const CollectionSidebarContainer = () => {
  const { control } = useFormContext<CollectionForm>();
  const collectionFormValues = useWatch<CollectionForm>({
    control,
  });

  return (
    <CollectionSidebarComponent collectionForm={collectionFormValues as CollectionForm} />
  );
};

export const CollectionSidebar = memo(CollectionSidebarContainer);
