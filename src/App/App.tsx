import { Outlet } from 'react-router-dom';
import { Notifications } from '@unique-nft/ui-kit';

import { AccountWrapper } from '@app/account';
import { PageSettingsWrapper } from '@app/context';
import { PageLayout } from '@app/components';

import './styles.scss';

export default function App() {
  return (
    <Notifications closingDelay={5000}>
      <AccountWrapper>
        <PageSettingsWrapper>
          <PageLayout>
            <Outlet />
          </PageLayout>
        </PageSettingsWrapper>
      </AccountWrapper>
    </Notifications>
  );
}
