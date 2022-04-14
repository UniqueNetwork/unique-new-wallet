import { Outlet } from 'react-router-dom';
// contains gql and rpc with contexts and providers
import ApiWrapper from '../api/ApiWrapper';
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
