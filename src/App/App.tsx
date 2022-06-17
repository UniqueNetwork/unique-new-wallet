import { Outlet } from 'react-router-dom';
import { Notifications } from '@unique-nft/ui-kit';

import { ApiWrapper } from '@app/api';
import { PageLayout } from '@app/components';
import { ChainPropertiesWrapper } from '@app/context';
import { AccountWrapper } from '@app/account';

import './styles.scss';

export default function App() {
  return (
    <ApiWrapper>
      <AccountWrapper>
        <ChainPropertiesWrapper>
          <PageLayout>
            <Notifications closingDelay={3000}>
              <Outlet />
            </Notifications>
          </PageLayout>
        </ChainPropertiesWrapper>
      </AccountWrapper>
    </ApiWrapper>
  );
}
