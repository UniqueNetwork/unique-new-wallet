import { Link } from '@unique-nft/ui-kit';
import React from 'react';

// TODO: add props rel, target to all Link component usages [WMS-871]
export const faqItems = [
  {
    title: 'How can I create a wallet?',
    content: (
      <p>
        Use either the{' '}
        <Link
          href="https://polkadot.js.org/extension/"
          title="Polkadot.js extension"
          role="primary"
          rel="noopener noreferrer"
          target="_blank"
        />{' '}
        or `Manage accounts` page and follow the instructions.
        <br />
        Keep your wallet seed phrase safe! Write it down on a paper or export the JSON key
        with a password you’ll never forget.
      </p>
    ),
  },
  {
    title: 'How can I connect my wallet?',
    content: (
      <>
        <p>
          Use the{' '}
          <Link
            href="https://polkadot.js.org/extension/"
            title="Polkadot.js extension"
            role="primary"
            rel="noopener noreferrer"
            target="_blank"
          />{' '}
          or the ‘Manage accounts page’ to set up or restore an account. Restore your
          wallet through the seed phrase, JSON file+password or QR code. When using Chrome
          or Firefox desktop with the Polkadot.js browser extension, set your account to
          `allow use on any chain`.
        </p>
        <p>
          Note that this option is not available to Ledger or TrustWallet users. Support
          for them will be added at a later date. If an NFT or a token was at any point
          transferred to one of these hardware wallets they are safe but you won’t be able
          to transfer them out until the support is added.
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
          stands true even if your collection will contain a single NFT. Please go to the
          “My collections” page and click the “Create collection” button. From there on
          you will be able to set the main information about the collection, the
          collection’s token attributes, and a number of advanced settings.
        </p>
        <p>
          After creating the collection, you can click on the “Create an NFT” button to
          create a token.
        </p>
      </>
    ),
  },
  {
    title: 'How much does it cost to create a collection?',
    content: (
      <p>
        About 5 QTZ to create and customize the collection. To obtain QTZ visit the{' '}
        <Link
          href="https://www.mexc.com/"
          title="MEXC Exchange"
          role="primary"
          rel="noopener noreferrer"
          target="_blank"
        />
      </p>
    ),
  },
  {
    title: 'How many tokens can I create?',
    content: (
      <p>
        You can create an unlimited number of collections and tokens. The current
        functionality does not allow for collections with a limited number of tokens to be
        created, but we will add this feature at a later date.
      </p>
    ),
  },
  {
    title: 'How can I transfer tokens to the other wallet or exchange?',
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
            Fungible tokens — go to coins section, select a token and click on the “Send”
            button
          </li>
          <li>NFTs — go to your NFT page and click on “Transfer” button</li>
        </ol>
      </>
    ),
  },
  {
    title: 'How can I burn an NFT?',
    content: (
      <p>
        You can burn both a collection and an NFT. By burning a collection, all tokens
        belonging to it will be deleted. A single NFT belonging to a collection can be
        deleted as well.
      </p>
    ),
  },
  {
    title: 'How can I find my collection in the blockchain?',
    content: (
      <p>
        Use our{' '}
        <Link
          href="https://uniquescan.io"
          title="UniqueScan"
          role="primary"
          rel="noopener noreferrer"
          target="_blank"
        />
        .
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
