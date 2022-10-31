import { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { CollectionSidebar as CollectionSidebarComponent } from '@app/components';

import { CollectionForm } from '../../types';

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
