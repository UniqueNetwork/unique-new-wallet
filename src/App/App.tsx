import { Outlet } from 'react-router-dom';
import { Notifications } from '@unique-nft/ui-kit';
import amplitude from 'amplitude-js';

import { AccountWrapper } from '@app/account';
import { PageLayout } from '@app/components';
import { PageSettingsWrapper } from '@app/context';
import { IntroCard } from '@app/components/IntroSlider/components';
import { IntroSlider } from '@app/components/IntroSlider';
import confetti from '@app/components/IntroSlider/components/images/confetti.svg';
import puzzle from '@app/components/IntroSlider/components/images/puzzle.svg';
import bundle from '@app/components/IntroSlider/components/images/bundle.svg';
import './styles.scss';

const ampKey = window.ENV?.AMPLITUDE_KEY || process.env.REACT_APP_AMPLITUDE_KEY || '';

amplitude.getInstance().init(ampKey);

export default function App() {
  // TODO: IntroSlider пока скрыт до необходимости
  return (
    <Notifications closingDelay={5000}>
      {false && (
        <IntroSlider>
          {({ setActiveSlide, setOpenModal }) => {
            return (
              <>
                <IntroCard
                  title="Fractional tokens and Bundles finally here!"
                  description="Meet the long-awaited update of Unique Wallet"
                  imgPath={confetti}
                  setActiveSlide={setActiveSlide}
                />
                <IntroCard
                  title="Fractional tokens"
                  description="A re-fungible format that allows for an NFT to be divided into many parts that can be distributed among any number of wallets"
                  imgPath={puzzle}
                  setActiveSlide={setActiveSlide}
                />
                <IntroCard
                  title="Bundle"
                  description="A way to group tokens in a nested, tree-like structure within NFT. Nesting of NFTs, Fractionals and coins in unlimited quantities is supported."
                  imgPath={bundle}
                  setActiveSlide={setActiveSlide}
                  isLast={true}
                  onCloseModal={() => setOpenModal(false)}
                />
              </>
            );
          }}
        </IntroSlider>
      )}
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
