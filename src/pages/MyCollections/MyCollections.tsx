import { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import { PagePaper } from '@app/components';

import { MyCollectionsFilter, MyCollectionsList } from './components';

interface MyCollectionsComponentProps {
  className?: string;
}

export const MyCollectionsComponent: VFC<MyCollectionsComponentProps> = ({
  className,
}) => {
  return (
    <PagePaper>
      <div className={classNames('my-collections', className)}>
        <MyCollectionsFilter />
        <MyCollectionsList />
      </div>
    </PagePaper>
  );
};

export const MyCollections = styled(MyCollectionsComponent)``;
