import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Notifications } from '@unique-nft/ui-kit';
import amplitude from 'amplitude-js';

import { AccountWrapper } from '@app/account';
import { config } from '@app/config';
import { useApi } from '@app/hooks';
import { defaultChainKey } from '@app/utils/configParser';
import { ROUTE } from '@app/routes';
import { PageSettingsWrapper } from '@app/context';
import { PageLayout } from '@app/components';

import './styles.scss';

let ampKey = '';

if (process.env.NODE_ENV === 'production') {
  ampKey =
    window.ENV?.AMPLITUDE_KEY_PROD || process.env.REACT_APP_AMPLITUDE_KEY_PROD || '';
} else {
  ampKey = window.ENV?.AMPLITUDE_KEY_DEV || process.env.REACT_APP_AMPLITUDE_KEY_DEV || '';
}
amplitude.getInstance().init(ampKey);

export default function App() {
  const location = useLocation();
  const chainFromUrl = config.chains[location.pathname.split('/')[1]];
  const { setCurrentChain } = useApi();

  if (chainFromUrl === undefined) {
    setCurrentChain(config.defaultChain);
    localStorage.setItem(defaultChainKey, config.defaultChain.network);
    return <Navigate to={`/${config.defaultChain.network}/${ROUTE.MY_TOKENS}`} />;
  } else {
    localStorage.setItem(defaultChainKey, chainFromUrl.network);
    setCurrentChain(chainFromUrl);
  }

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
