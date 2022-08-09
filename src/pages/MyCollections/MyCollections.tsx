import { useEffect, VFC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import { useApi } from '@app/hooks';
import { usePageSettingContext } from '@app/context';
import { PagePaperNoPadding } from '@app/components';
import { MyCollectionsWrapper } from '@app/pages/MyCollections/MyCollectionsWrapper';

import { useMyCollectionsContext } from './context';
import { MyCollectionsFilter, MyCollectionsList } from './components';

interface MyCollectionsComponentProps {
  className?: string;
}

export const MyCollectionsComponent: VFC<MyCollectionsComponentProps> = ({
  className,
}) => {
  const { currentChain } = useApi();
  const location = useLocation();
  const isCollectionsListPath =
    location.pathname === `/${currentChain?.network}/my-collections`;
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();
  const { order, page, search, onChangePagination } = useMyCollectionsContext();

  useEffect(() => {
    setPageBreadcrumbs({ options: [] });
    setPageHeading('My collections');
  }, []);

  return (
    <PagePaperNoPadding className={classNames('data-grid', 'my-collections', className)}>
      {isCollectionsListPath ? (
        <>
          <MyCollectionsFilter />
          <MyCollectionsList
            order={order}
            page={page}
            search={search}
            onPageChange={onChangePagination}
          />
        </>
      ) : (
        <Outlet />
      )}
    </PagePaperNoPadding>
  );
};

export const MyCollections = () => (
  <MyCollectionsWrapper>
    <MyCollectionsComponent />
  </MyCollectionsWrapper>
);
