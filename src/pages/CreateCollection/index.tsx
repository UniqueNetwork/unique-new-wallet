import { useForm, FormProvider } from 'react-hook-form';

import { useAccounts } from '@app/hooks';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { ROUTE } from '@app/routes';

import { CollectionForm } from './types';
import { FeeProvider } from './context';
import { CreateCollectionComponent } from './CreateCollection';

export * from './CreateCollection';

export const CreateCollectionForm = () => {
  const { selectedAccount } = useAccounts();
  const collectionForm = useForm<CollectionForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      address: selectedAccount?.address,
      nesting: {
        tokenOwner: false,
      },
    },
  });

  return (
    <FormProvider {...collectionForm}>
      <FeeProvider>
        <CreateCollectionComponent />
      </FeeProvider>
    </FormProvider>
  );
};

export const CreateCollection = withPageTitle({
  header: 'Create a collection',
  backLink: ROUTE.MY_COLLECTIONS,
})(CreateCollectionForm);
