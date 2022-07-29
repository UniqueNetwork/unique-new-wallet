import { useEffect, VFC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';

import { usePageSettingContext } from '@app/context';
import { PagePaperNoPadding } from '@app/components';
import { MyCollectionsWrapper } from '@app/pages/MyCollections/MyCollectionsWrapper';
import { useApi } from '@app/hooks';

import { useMyCollectionsContext } from './context';
import { MyCollectionsFilter, MyCollectionsList } from './components';

interface MyCollectionsComponentProps {
  className?: string;
}

const MyCollectiosWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .my-collections-filter,
  .my-collections-list {
    box-sizing: border-box;
    width: 100%;
  }

  .my-collections-filter {
    flex: 0 0 auto;
  }

  .my-collections-list {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .unique-loader {
    margin: auto;
  }
`;

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
    <PagePaperNoPadding>
      {isCollectionsListPath ? (
        <MyCollectiosWrapper className={classNames('my-collections', className)}>
          <MyCollectionsFilter />
          <MyCollectionsList
            order={order}
            page={page}
            search={search}
            onPageChange={onChangePagination}
          />
        </MyCollectiosWrapper>
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
