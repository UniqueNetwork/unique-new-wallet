import React from 'react';
import styled from 'styled-components/macro';
import { Accordion, Button, Heading, Icon, Link, Text } from '@unique-nft/ui-kit';
import { Link as RouterLink } from 'react-router-dom';

// TODO: add props rel, target to all Link component usages [WMS-871]
const faqItems = [
  {
    title: 'How can I create a wallet?',
    content: (
      <p>
        Use either the{' '}
        <Link
          href="https://polkadot.js.org/extension/"
          title={'Polkadot.js extension'}
          role="primary"
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
            title={'Polkadot.js extension'}
            role="primary"
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
        About 5 QTZ to create and customize the collection. To obtain QTZ visit the MEXC
        Exchange:{' '}
        <Link href="https://www.mexc.com/" title="https://www.mexc.com/" role="primary" />
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
        Use our <Link href="https://uniquescan.io" title="UniqueScan" role="primary" />.
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

export const Faq = (): React.ReactElement<void> => {
  return (
    <>
      <Heading size="1">FAQ</Heading>
      <MainWrapper>
        <WrapperContent>
          <Plate>
            {faqItems.map((item, i) => {
              return (
                <Accordion key={i} className="faq-item" title={item.title}>
                  {item.content}
                </Accordion>
              );
            })}
          </Plate>
        </WrapperContent>
        <WrapperSide>
          <SidePlate>
            <Heading size="3">Didn&apos;t find the answer? Write&nbsp;to us.</Heading>
            <Button title="Ask a question" />
            <SidePlateFooter>
              <Text>You can also find information in our community</Text>
              <SocialNav>
                <RouterLink
                  to="https://t.me/Uniquechain"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon
                    name="social-telegram"
                    color="var(--color-primary-500)"
                    size={32}
                  />
                </RouterLink>
                <RouterLink
                  to="https://twitter.com/Unique_NFTchain"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon
                    name="social-twitter"
                    color="var(--color-primary-500)"
                    size={32}
                  />
                </RouterLink>
                <RouterLink
                  to="https://discord.gg/jHVdZhsakC"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon
                    name="social-discord"
                    color="var(--color-primary-500)"
                    size={32}
                  />
                </RouterLink>
                <RouterLink
                  to="https://github.com/UniqueNetwork"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon name="social-github" color="var(--color-primary-500)" size={32} />
                </RouterLink>
                <RouterLink
                  to="https://app.subsocial.network/@UniqueNetwork_NFT"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon
                    name="social-subsocial"
                    color="var(--color-primary-500)"
                    size={32}
                  />
                </RouterLink>
              </SocialNav>
            </SidePlateFooter>
          </SidePlate>
        </WrapperSide>
      </MainWrapper>
    </>
  );
};

const MainWrapper = styled.div`
  gap: var(--prop-gap);

  @media screen and (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr min(380px);
    gap: calc(var(--prop-gap) * 2);
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: 1fr min(580px);
  }
`;

const WrapperContent = styled.section``;

const WrapperSide = styled.aside``;

const Plate = styled.div`
  background-color: var(--color-additional-light);

  @media screen and (min-width: 1024px) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: calc(var(--prop-border-radius) * 2);
    padding: calc(var(--prop-gap) * 2);
  }

  .faq-item {
    border-bottom: 1px dashed var(--color-blue-grey-300);
    max-width: 820px;
    font-size: 1rem;
    line-height: 1.4;

    &:not(:last-child) {
      margin-bottom: calc(var(--prop-gap) * 2);
    }

    .unique-accordion-title {
      margin-bottom: var(--prop-gap);
      font-weight: 700;
      font-size: 1.25rem;
    }

    .unique-accordion-content {
      padding: 10px;
      background-color: var(--color-blue-grey-100);
    }

    ol,
    ul,
    .unique-link {
      font: inherit;
    }

    ol,
    ul {
      padding-left: 1.5em;
      list-style-position: inside;

      li {
        &:not(:first-child) {
          margin-top: 0.1em;
        }
      }
    }

    p + p {
      margin-top: 1.125em;
    }
  }
`;

const SidePlate = styled(Plate)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 2.5);
  text-align: center;

  @media screen and (min-width: 1024px) {
    padding: calc(var(--prop-gap) * 2);
  }

  .unique-button {
    min-width: 50%;
  }
`;

const SidePlateFooter = styled.div`
  display: none;

  @media screen and (min-width: 1024px) {
    display: block;
    margin-top: calc(var(--prop-gap) * 2);
  }
`;

const SocialNav = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: var(--prop-gap);

  a {
    &:not(:first-child) {
      margin-left: var(--prop-gap);
    }
  }
`;

export default Faq;
