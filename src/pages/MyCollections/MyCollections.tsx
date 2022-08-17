import { useEffect, VFC } from 'react';
import { Outlet, useOutlet } from 'react-router-dom';
import classNames from 'classnames';

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
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();
  const { order, page, search, onChangePagination } = useMyCollectionsContext();

  const isChildExist = useOutlet();

  useEffect(() => {
    setPageBreadcrumbs({ options: [] });
    setPageHeading('My collections');
  }, []);

  return (
    <PagePaperNoPadding className={classNames('data-grid', 'my-collections', className)}>
      {!isChildExist ? (
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
