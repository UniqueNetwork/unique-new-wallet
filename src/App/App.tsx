import { Outlet } from 'react-router-dom';
import { Notifications } from '@unique-nft/ui-kit';

import { PageLayout } from '@app/components';
import { AccountWrapper } from '@app/account';

import './styles.scss';

export default function App() {
  return (
    <Notifications closingDelay={5000}>
      <AccountWrapper>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </AccountWrapper>
    </Notifications>
  );
}
