import { Outlet } from 'react-router-dom';
import { Notifications } from '@unique-nft/ui-kit';

import { ApiWrapper } from '@app/api';
import { PageLayout } from '@app/components';
import { ChainPropertiesWrapper } from '@app/context';
import { AccountWrapper } from '@app/account';

import './styles.scss';

export default function App() {
  return (
    <Notifications closingDelay={5000}>
      <ApiWrapper>
        <AccountWrapper>
          <ChainPropertiesWrapper>
            <PageLayout>
              <Outlet />
            </PageLayout>
          </ChainPropertiesWrapper>
        </AccountWrapper>
      </ApiWrapper>
    </Notifications>
  );
}
