import { useForm, FormProvider } from 'react-hook-form';

import { useAccounts } from '@app/hooks';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { ROUTE } from '@app/routes';

import { CollectionForm } from './types';
import { FeeProvider } from './context';
import { CreateCollection } from './CreateCollection';

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
        <CreateCollection />
      </FeeProvider>
    </FormProvider>
  );
};

export const CreateCollectionPage = withPageTitle({
  header: 'Create a collection',
  backLink: ROUTE.MY_COLLECTIONS,
})(CreateCollectionForm);
