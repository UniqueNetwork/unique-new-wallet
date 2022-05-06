import { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Outlet, useLocation } from 'react-router-dom';

import { PagePaperNoPadding } from '@app/components';

import { MyCollectionsFilter, MyCollectionsList } from './components';

interface MyCollectionsComponentProps {
  className?: string;
}

export const MyCollectionsComponent: VFC<MyCollectionsComponentProps> = ({
  className,
}) => {
  const location = useLocation();
  const isCollectionsListPath = location.pathname === '/my-collections';

  return (
    <PagePaperNoPadding>
      {isCollectionsListPath ? (
        <div className={classNames('my-collections', className)}>
          <MyCollectionsFilter />
          <MyCollectionsList />
        </div>
      ) : (
        <Outlet />
      )}
    </PagePaperNoPadding>
  );
};

export const MyCollections = styled(MyCollectionsComponent)``;
