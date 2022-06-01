import { Outlet } from 'react-router-dom';

import { ApiWrapper } from '@app/api';
import { PageLayout } from '@app/components';
import { AccountWrapper } from '@app/account';

import './styles.scss';

export default function App() {
  return (
    <ApiWrapper>
      <AccountWrapper>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </AccountWrapper>
    </ApiWrapper>
  );
}
