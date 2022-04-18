import { Outlet } from 'react-router-dom';
import { ApiWrapper } from '@app/api';
import { PageLayout } from '../components';
import AccountWrapper from '../account/AccountProvider';

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
