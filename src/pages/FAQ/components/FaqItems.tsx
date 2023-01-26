import { Link } from 'react-router-dom';
import { Icon, Link as UiLink } from '@unique-nft/ui-kit';

import { config } from '@app/config';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';

export const faqItems = <T extends Record<string, unknown>>(
  activeNetwork: string,
  state: T,
) => {
  return [
    {
      title: 'How can I create or connect my account?',
      content: (
        <>
          <p>
            Use the “
            <Link to={`/${activeNetwork}/${ROUTE.ACCOUNTS}`}>Connect wallet</Link>” button
            in&nbsp;the upper right corner of&nbsp;the screen and follow the instructions.
            You can choose between Polkadot.js and Metamask or&nbsp;create/connect
            a&nbsp;wallet directly via the Unique Wallet on-line interface. When using
            Chrome or&nbsp;Firefox desktop with the Polkadot.js browser extension, set
            your account to&nbsp;“allow use on any chain”.
          </p>
          <p>
            Note that this option is&nbsp;not available to&nbsp;Ledger or&nbsp;Trust
            Wallet users. Support for these wallets will be&nbsp;added
            at&nbsp;a&nbsp;later date. If, by&nbsp;chance, you happened to&nbsp;transfer
            any tokens to&nbsp;one of&nbsp;the unsupported wallets,rest assured that your
            funds are safe in&nbsp;the wallet, but they are currently inaccessible until
            support for the wallet is&nbsp;added.
          </p>
        </>
      ),
    },
    {
      title: (
        <>
          What should I do to mint my first NFT? <span className="tooltip">NEW</span>
        </>
      ),
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
      title: 'What is a fractional token?',
      content: (
        <>
          <p>
            This is a re-fungible format that allows for an&nbsp;NFT
            to&nbsp;be&nbsp;divided into many parts that can be&nbsp;distributed among any
            number of&nbsp;wallets. You can learn more aboout this in this article:{' '}
            <UiLink
              href="https://unique.network/blog/re-fungible-nfts/"
              title="@unique2faucet_opal_bot"
              role="primary"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://unique.network/blog/re-fungible-nfts/
            </UiLink>
          </p>
        </>
      ),
    },
    {
      title: (
        <>
          What is nesting <span className="tooltip">NEW</span>
        </>
      ),
      defaultExpanded: 'isNestedInfo' in state,
      content: (
        <>
          <p>
            Nesting is the creation of an on-chain connection between tokens. The elements
            are grouped into a nested tree-like structure within a single NFT. This NFT is
            called a bundle root. Tokens nested in a bundle are called a tree branches. Of
            the two connected tokens, a token with a connection that is closer to the root
            is considered a parent and all its other attachments children. In an ordered
            tree, each branch can have only one parent but a parent may have many
            children.
          </p>
          <p>
            Only an NFT can be a parent; however, a child can be any of the following: an
            NFT, a Fraction or a Coin. <br />
            The owner of the bundle is the user (wallet), but the owner of the nested
            token is another token. <br />
            The number of attachments is unlimited, but there can be no more than 5 levels
            of nesting.
          </p>
        </>
      ),
    },
    {
      title: (
        <>
          How do I nest and manipulate a nested token?
          <span className="tooltip">NEW</span>
        </>
      ),
      defaultExpanded: 'isNestedInfo' in state,
      content: (
        <>
          <p>
            Nesting is performed by transferring a token to the address of a (parent) NFT.
            Both tokens must belong to the same owner. To nest to a token one must own it.
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            To perform the nesting click on "Nest this token" in the token details page. A
            modal window will display a list of collections (of which you are the owner)
            that allow nesting, as well as an opportunity to chose a token that you wish
            to nest. If the token you are nesting is an NFT it will automatically become
            the parent of subsequent nesting operations.
          </p>
          <p>
            Bundles and nested tokens can be stored in a wallet, transferred to other
            accounts, withdrawn and burned. Some important nesting rules to remember are:
          </p>
          <div>
            <div>
              1. Transferring a parent transfers the entire branch below the parent with
              all the children.
            </div>
            <div>
              2. Only the owner of the parent token can withdraw the token from the
              bundle.
            </div>
            <div>
              3. A token that contains nested branches (a non-empty bundle) cannot be
              burned; for this, all branches must first be unnested. Only then will the
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              "Burn token" menu item in the ellipsis menu (in the upper right corner)
              become accessible.
            </div>
          </div>
        </>
      ),
    },
    {
      title: 'How much does it cost to create a collection or a token?',
      content: (
        <>
          <p>The cost of create the collection rally consists of:</p>
          <ol>
            <li>Fixed commission Unique = 2 coins.</li>
            <li>Transfer fee ≈ 0.1 coins.</li>
            <li>
              Network fees, which varies depending on the amount of data uploaded to the
              blockchain.
            </li>
          </ol>
          <p>
            The cost of minting the token depends on the number of properties specified.
          </p>
        </>
      ),
    },
    {
      title: 'Where can I get coins?',
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
            href={config.cryptoExchangeUNQ}
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
      title: 'How do I transfer tokens to another wallet or exchange?',
      content: (
        <>
          <p>
            Both fungible and non-fungible tokens can be transferred via the corresponding
            utility page.
            <br />
            For:
          </p>
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
        </>
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
      title:
        'I want to find my collections and tokens in the blockchain. Where can I search for them?',
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
      title: 'Is it possible to change an existing collection’s name?',
      content: (
        <p>
          The core collection information cannot be modified once approved/signed. For any
          changes the collection will need to be burned and re-created.
        </p>
      ),
    },
  ];
};
