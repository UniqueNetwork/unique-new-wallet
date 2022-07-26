import { useEffect } from 'react';
import classNames from 'classnames';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heading } from '@unique-nft/ui-kit';

import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { CollectionSidebar } from '@app/components';
import { CollectionFormProvider } from '@app/context/CollectionFormContext/CollectionFormProvider';
import { CREATE_COLLECTION_TABS_ROUTE, ROUTE } from '@app/routes';

interface CreateCollectionProps {
  className?: string;
}

export const CreateCollection = ({ className }: CreateCollectionProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/create-collection') {
      navigate(
        `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION}`,
      );
    }
  }, [location.pathname, navigate]);

  return (
    <CollectionFormProvider>
      <Heading size="1">Create a collection</Heading>
      <MainWrapper className={classNames('create-collection-page', className)}>
        <WrapperContent>
          <Outlet />
        </WrapperContent>
        <CollectionSidebar />
      </MainWrapper>
    </CollectionFormProvider>
  );
};
