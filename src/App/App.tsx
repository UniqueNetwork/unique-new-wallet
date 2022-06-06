import { Outlet } from 'react-router-dom';

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
            <Outlet />
          </PageLayout>
        </ChainPropertiesWrapper>
      </AccountWrapper>
    </ApiWrapper>
  );
}
