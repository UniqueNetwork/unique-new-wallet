import { Outlet } from 'react-router-dom';
import amplitude from 'amplitude-js';

import { AccountWrapper } from '@app/account';
import { Notifications, PageLayout } from '@app/components';
import { ConnectWalletModalProvider, PageSettingsWrapper } from '@app/context';
import { IntroCard } from '@app/components/IntroSlider/components';
import { IntroSlider } from '@app/components/IntroSlider';
import confetti from '@app/components/IntroSlider/components/images/confetti.svg';
import bundle from '@app/components/IntroSlider/components/images/bundle.svg';
import puzzle from '@app/components/IntroSlider/components/images/puzzle.svg';
import { ConnectWallets } from '@app/pages';

import './styles.scss';

const ampKey = window.ENV?.AMPLITUDE_KEY || process.env.REACT_APP_AMPLITUDE_KEY || '';

amplitude.getInstance().init(ampKey);

export default function App() {
  return (
    <Notifications closingDelay={5000}>
      <AccountWrapper>
        <ConnectWalletModalProvider>
          <IntroSlider>
            {({ setActiveSlide, setOpenModal }) => {
              return (
                <>
                  <IntroCard
                    // title={<>Fractional tokens and Bundles finally here!</>}
                    title="Bundles are finally here!"
                    description={<>Meet the long-awaited update of&nbsp;Unique Wallet</>}
                    imgPath={confetti}
                    setActiveSlide={setActiveSlide}
                  />
                  <IntroCard
                    title="Fractional tokens"
                    description={
                      <>
                        A&nbsp;re-fungible format that allows for an&nbsp;NFT
                        to&nbsp;be&nbsp;divided into many parts that can
                        be&nbsp;distributed among any number of&nbsp;wallets
                      </>
                    }
                    imgPath={puzzle}
                    setActiveSlide={setActiveSlide}
                  />
                  <IntroCard
                    title="Nesting"
                    description={
                      <>
                        A&nbsp;way to&nbsp;group tokens in&nbsp;a&nbsp;nested, tree-like
                        structure within NFT. Nesting of&nbsp;NFTs, Fractionals and coins
                        in&nbsp;unlimited quantities is&nbsp;supported.
                      </>
                    }
                    imgPath={bundle}
                    setActiveSlide={setActiveSlide}
                    isLast={true}
                    onCloseModal={() => setOpenModal(false)}
                  />
                </>
              );
            }}
          </IntroSlider>
          <PageSettingsWrapper>
            <ConnectWallets />
            <PageLayout>
              <Outlet />
            </PageLayout>
          </PageSettingsWrapper>
        </ConnectWalletModalProvider>
      </AccountWrapper>
    </Notifications>
  );
}
