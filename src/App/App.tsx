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
                    isLast
                    title="Dear AngelHackers, your NFT is SoulBound!"
                    description={
                      <>
                        Wear & change your hoodies, share on&nbsp;socials. These belong
                        to&nbsp;you forever! To&nbsp;start nesting click on&nbsp;any
                        of&nbsp;your wearable NFTs!
                      </>
                    }
                    imgPath={confetti}
                    setActiveSlide={setActiveSlide}
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
