import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { Accordion } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';
import {
  MainWrapper,
  WrapperContent,
  WrapperSidebar,
} from '@app/pages/components/PageComponents';
import { withPageTitle } from '@app/HOCs/withPageTitle';

import { AskQuestion, faqItems } from './components';

const WrapperContentStyled = styled(WrapperContent)`
  .faq-item {
    border-bottom: 1px dashed var(--color-blue-grey-300);
    font-size: 1rem;
    line-height: 1.4;
    color: var(--color-additional-dark);

    &:not(:last-child) {
      margin-bottom: calc(var(--prop-gap) * 2);
    }

    .unique-accordion-title {
      margin-bottom: var(--prop-gap);
      color: inherit;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .unique-accordion-content {
      padding: 10px;
      line-height: 1.5;
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

      li {
        &:not(:first-child) {
          margin-top: 0.1em;
        }
      }
    }

    ol {
      list-style-position: inside;
    }

    ul,
    ol,
    p {
      & + p {
        margin-top: 1.125em;
      }
    }

    a:not([class]),
    .unique-link {
      gap: 2px;
      color: var(--color-primary-600);

      &:hover {
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 0.3em;
      }

      &:focus-visible {
        outline: -webkit-focus-ring-color auto 1px;
      }
    }
  }
`;

const FaqComponent = (): React.ReactElement<void> => {
  const { currentChain } = useApi();

  return (
    <MainWrapperStyled>
      <WrapperContentStyled>
        {faqItems(currentChain.network).map(
          (item: Record<string, ReactNode>, i: number) => {
            return (
              <Accordion
                key={i}
                className="faq-item"
                expanded={i === 0}
                title={item.title}
              >
                {item.content}
              </Accordion>
            );
          },
        )}
      </WrapperContentStyled>
      <WrapperSidebar>
        <AskQuestion />
      </WrapperSidebar>
    </MainWrapperStyled>
  );
};

const MainWrapperStyled = styled(MainWrapper)`
  @media only screen and (min-width: 800px) and (max-width: 1024px) {
    width: 85%;
  }

  .unique-modal-wrapper {
    padding: calc(var(--prop-gap) * 5) 5%;
    box-sizing: border-box;

    @media screen and (max-width: 567px) {
      .unique-modal {
        padding: calc(var(--prop-gap));

        .unique-font-heading {
          font-size: 24px;
          text-align: left;
        }

        .close-button {
          top: 20px;
        }
      }
    }
  }
`;

export const Faq = withPageTitle({ header: 'FAQ' })(FaqComponent);
