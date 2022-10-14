import { Link } from 'react-router-dom';
import { Icon, Link as UiLink } from '@unique-nft/ui-kit';

import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';

export const faqItems = (activeNetwork: string) => {
  return [
    {
      title: 'How can I create a wallet?',
      content: (
        <>
          <p>
            Use either the{' '}
            <UiLink
              href="https://polkadot.js.org/extension/"
              rel="noopener noreferrer"
              target="_blank"
            >
              {`Polkadot{.js} extension`}
              <Icon color="currentColor" name="arrow-up-right" size={16} />
            </UiLink>{' '}
            or <Link to={`/${activeNetwork}/${ROUTE.ACCOUNTS}`}>Manage accounts</Link> in
            the drop-down list in the upper right corner of the screen page and follow the
            instructions.
          </p>
          <p>
            Keep your wallet seed phrase safe! Write it down on a paper or export the JSON
            key with a password you’ll never forget.
          </p>
        </>
      ),
    },
    {
      title: 'How can I connect my wallet?',
      content: (
        <>
          <p>
            Use the{' '}
            <UiLink
              href="https://polkadot.js.org/extension/"
              rel="noopener noreferrer"
              target="_blank"
            >
              {`Polkadot{.js} extension`}
              <Icon color="currentColor" name="arrow-up-right" size={16} />
            </UiLink>{' '}
            or the <Link to={`/${activeNetwork}/${ROUTE.ACCOUNTS}`}>Manage accounts</Link>{' '}
            in the drop-down list in the upper right corner of the screen to set up or
            restore an account. Restore your wallet through the seed phrase, JSON
            file+password or QR code. When using Chrome or Firefox desktop with the
            Polkadot.js browser extension, set your account to “allow use on any chain”.
          </p>
          <p>
            Note that this option is not available to Ledger or TrustWallet users. Support
            for them will be added at a later date. If an NFT or a token was at any point
            transferred to one of these hardware wallets they are safe but you won’t be
            able to transfer them out until the support is added.
          </p>
        </>
      ),
    },
    {
      title: 'How can I mint an NFT?',
      content: (
        <>
          <p>
            If you wish to mint an NFT, the first step is to create a collection. This
            stands true even if your collection will contain a single NFT. Please go to
            the{' '}
            <Link to={`/${activeNetwork}/${ROUTE.MY_COLLECTIONS}`}>My collections</Link>{' '}
            page and click the “Create collection” button. From there on you will be able
            to set the main information about the collection, the collection’s token
            attributes, and a number of advanced settings.
          </p>
          <p>
            After creating the collection, you can click on the “Create an NFT” button to
            create a token.
          </p>
        </>
      ),
    },
    {
      title: 'How much does it cost to create a collection or a token?',
      content: (
        <>
          <p>
            The cost of create the collection rally consists of: <br />
            <ol>
              <li>Fixed commission Unique = 2 coins.</li>
              <li>Transfer fee ≈ 0.1 coins.</li>
              <li>
                Network fees, which varies depending on the amount of data uploaded to the
                blockchain.
              </li>
            </ol>
          </p>
          <p>
            The cost of minting the token depends on the number of properties specified.
          </p>
        </>
      ),
    },
    {
      title: 'How can I get coins?',
      content: (
        <p>
          To obtain QTZ visit the{' '}
          <UiLink
            href="https://www.mexc.com/exchange/QTZ_USDT"
            role="primary"
            rel="noopener noreferrer"
            target="_blank"
          >
            MEXC Exchange
            <Icon color="currentColor" name="arrow-up-right" size={16} />
          </UiLink>
          <br />
          You can get OPL in this Telegram bot{' '}
          <UiLink
            href="https://t.me/unique2faucet_opal_bot"
            title="@unique2faucet_opal_bot"
            role="primary"
            rel="noopener noreferrer"
            target="_blank"
          />
          .
          <br />
          To obtain UNQ visit the{' '}
          <UiLink
            href="https://www.huobi.com/en-us/exchange/unq_usdt"
            role="primary"
            rel="noopener noreferrer"
            target="_blank"
          >
            Huobi Global
            <Icon color="currentColor" name="arrow-up-right" size={16} />
          </UiLink>
        </p>
      ),
    },
    {
      title: 'How many tokens can I create?',
      content: (
        <p>
          You can create an unlimited number of collections and tokens. The current
          functionality does not allow for collections with a limited number of tokens to
          be created, but we will add this feature at a later date.
        </p>
      ),
    },
    {
      title: 'How can I transfer tokens to the other wallet or exchange?',
      content: (
        <p>
          Both fungible and non-fungible tokens can be transferred via the corresponding
          utility page.
          <br />
          For:
          <br />
          <ol>
            <li>
              Fungible tokens — go to{' '}
              <Link
                to={`/${activeNetwork}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.COINS}`}
              >
                Coins
              </Link>{' '}
              section, select a token and click on the “Send” button
            </li>
            <li>NFTs — go to your NFT page and click on “Transfer” button</li>
          </ol>
        </p>
      ),
    },
    {
      title: 'How can I burn a collection or a token?',
      content: (
        <p>
          To burn a collection, you first need to burn all its tokens. A single NFT
          belonging to a collection can be deleted as well.
        </p>
      ),
    },
    {
      title: 'How can I find my collection in the blockchain?',
      content: (
        <p>
          Use our{' '}
          <UiLink href="https://uniquescan.io" rel="noopener noreferrer" target="_blank">
            UniqueScan
            <Icon color="currentColor" name="arrow-up-right" size={16} />
          </UiLink>
        </p>
      ),
    },
    {
      title: 'How can I change an existing collection’s name?',
      content: (
        <p>
          The core collection information cannot be modified once approved/signed. For any
          changes the collection will need to be burned and re-created.
        </p>
      ),
    },
  ];
};
