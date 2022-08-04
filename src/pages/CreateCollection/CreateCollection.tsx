import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { usePageSettingContext } from '@app/context';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { CollectionSidebar } from '@app/components';

interface CreateCollectionProps {
  className?: string;
}

export const CreateCollection: FC<CreateCollectionProps> = (props) => {
  const { className } = props;
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/create-collection') {
      navigate('/create-collection/main-information');
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    setPageBreadcrumbs({ options: [] });
    setPageHeading('Create a collection');
  }, []);

  return (
    <MainWrapper className={classNames('create-collection-page', className)}>
      <WrapperContent>
        <Outlet />
      </WrapperContent>
      <CollectionSidebar />
    </MainWrapper>
  );
};
