import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Notifications } from '@unique-nft/ui-kit';

import { AccountWrapper } from '@app/account';
import { config } from '@app/config';
import { useApi } from '@app/hooks';
import { defaultChainKey } from '@app/utils/configParser';
import { ROUTE } from '@app/routes';
import { PageSettingsWrapper } from '@app/context';
import { PageLayout } from '@app/components';

import './styles.scss';

export default function App() {
  const location = useLocation();
  const chainFromUrl = config.chains[location.pathname.split('/')[1]];
  const { setCurrentChain } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (chainFromUrl === undefined) {
      setCurrentChain(config.defaultChain);
      localStorage.setItem(defaultChainKey, config.defaultChain.network);
      navigate(`/${config.defaultChain.network}/${ROUTE.MY_TOKENS}`);
    } else {
      localStorage.setItem(defaultChainKey, chainFromUrl.network);
      setCurrentChain(chainFromUrl);
    }
  }, []);

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
