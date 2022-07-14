import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heading } from '@unique-nft/ui-kit';

import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { CollectionSidebar } from '@app/components';

interface CreateCollectionProps {
  className?: string;
}

export const CreateCollection: FC<CreateCollectionProps> = (props) => {
  const { className } = props;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/create-collection') {
      navigate('/create-collection/main-information');
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Heading size="1">Create a collection</Heading>
      <MainWrapper className={classNames('create-collection-page', className)}>
        <WrapperContent>
          <Outlet />
        </WrapperContent>
        <CollectionSidebar />
      </MainWrapper>
    </>
  );
};
