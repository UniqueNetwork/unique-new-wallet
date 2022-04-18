import React from 'react';
import styled from 'styled-components/macro';

import { Heading } from '@unique-nft/ui-kit';
import { PagePaper } from '@app/components';

export const Faq = (): React.ReactElement<void> => {
  return (
    <PagePaper>
      <MainWrapper>
        <Heading size='4'>Q: How can I connect my wallet?</Heading>
        <p>
          A: You can use either{' '}
          <a href='https://polkadot.js.org/extension/'>
            https://polkadot.js.org/extension/
          </a>{' '}
          or the market `Accounts` page. Restore your wallet through the seed
          phrase, JSON file+password or QR code.
        </p>
        <p>
          Make sure that using Chrome or Firefox desktop with the Polkadot.js
          browser extension you’ve set your wallet account setting to `allow use
          on any chain`.
        </p>
        <p>
          Note that this option is not available to Ledger or TrustWallet users,
          their support will be added later. Rest assured your NFT is still safe
          in your wallet!
        </p>
        <Heading size='4'>
          Q: I connected the right wallet to the app but it shows that my
          SubstraPunk|Chelobrick belongs to a different address. Why?
        </Heading>
        <p>
          A: Substrate account addresses (Polkadot, Kusama etc.) may look
          different on different networks but they have all the same private key
          underneath. You can see all transformations of any address on{' '}
          <a href='https://polkadot.subscan.io/tools/ss58_transform'>
            https://polkadot.subscan.io/tools/ss58_transform
          </a>
        </p>
        <Heading size='4'>Q: How can I create a wallet?</Heading>
        <p>
          A: You can use either{' '}
          <a href='https://polkadot.js.org/extension/'>
            https://polkadot.js.org/extension/
          </a>{' '}
          or the market ‘Accounts’ page and follow the instructions.{' '}
        </p>
        <p>
          Keep your wallet seed phrase safe! Write it down on paper or export
          the JSON key with a password you would never forget.
        </p>
        <Heading size='4'>Q: How can I get KSM to my account?</Heading>
        <p>
          A: You need to transfer (withdraw) from the other wallet or exchange.
          To do that:
        </p>
        <ol>
          <li>
            Copy your address at the marketplace (click on the icon at the top
            right corner);
          </li>
          <li>
            Go to the{' '}
            <a href='https://polkadot.subscan.io/tools/ss58_transform'>
              https://polkadot.subscan.io/tools/ss58_transform
            </a>{' '}
            and transform your address;
          </li>
          <li>Copy your address at Kusama network;</li>
          <li>
            Use this Kusama address to send KSM from any wallet or exchange;
          </li>
        </ol>
        <Heading size='4'>
          Q: I see my NTF on the My tokens page twice and one of them is `on
          hold`
        </Heading>
        <p>
          A: It can happen if the previous version of the market had information
          about an unfinished listing. In that case:
        </p>
        <ol>
          <li>Go to the page of ‘on hold’ token and complete listing;</li>
          <li>Then delist this token;</li>
        </ol>
        <Heading size='4'>
          Q: I see the error `1010: Invalid Transaction: Inability to pay some
          fees, e.g. account balance too low`
        </Heading>
        <p>A: Just wail for half a minute and try again</p>
        <Heading size='4'>
          Q: I am trying to buy an NFT, but I am seeing the other owner and the
          “Withdraw your KSM” button on the Heading is active. Why?
        </Heading>
        <p>
          A: Unfortunately someone has beaten you in buying the same NFT, but
          you can either withdraw your KSM back to your wallet or leave it in
          the deposit balance to use in future purchases.
        </p>

        <Heading size='4'>
          Q: How to transfer KSM to the other wallet or exchange?
        </Heading>
        <p>
          A: KSM that you use and see on the marketplace is on your Kusama
          (Substrate) account, you don`t have to withdraw it. You can interact
          with your wallet using any Polkadot/Kusama network tool. To transfer
          KSM to the other wallet or exchange:
        </p>
        <ol>
          <li>
            Go to `Accounts` at{' '}
            <a href='https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama-rpc.polkadot.io#/accounts'>
              https://polkadot.js.org/apps/accounts
            </a>
          </li>
          <li>
            {' '}
            Restore your wallet through the seed phrase, JSON file+password or
            QR code.Make sure that using Chrome or Firefox desktop with the
            Polkadot.js browser extension you’ve set your wallet account setting
            to `allow use on any chain`.
          </li>
          <li>Send KSM anywhere you want</li>
        </ol>
        <Heading size='4'>Q: Where can I read the Terms of Service?</Heading>
        <p>
          A: You can read our Terms of Service&nbsp;
          <a download href='/files/Terms.pdf'>
            here.
          </a>
        </p>

        <Heading size='4'>
          Q: Whom can I contact if I have questions regarding the marketplace?
        </Heading>
        <p>
          Please contact{' '}
          <a href='mailto:unqnftsupport@unique.network'>
            unqnftsupport@unique.network
          </a>{' '}
          if you have any questions.
        </p>
      </MainWrapper>
    </PagePaper>
  );
};

const MainWrapper = styled.div`
  display: block !important;
  max-width: 1168px;

  p,
  ol li {
    font-size: 16px;
    line-height: 24px;
    font-family: var(--font-main);
    font-weight: 400;
    margin-bottom: 0;
    letter-spacing: normal;
  }

  ol {
    padding-left: 17px;
  }
`;

export default Faq;

// export default React.memo(Faq);
