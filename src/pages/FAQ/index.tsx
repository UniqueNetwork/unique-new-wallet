import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { useLocation } from 'react-router-dom';

import { useApi } from '@app/hooks';
import {
  MainWrapper,
  WrapperContent,
  WrapperSidebar,
} from '@app/pages/components/PageComponents';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import Accordion from '@app/components/Accordion/Accordion';

import { AskQuestion, faqItems } from './components';

const WrapperContentStyled = styled(WrapperContent)`
  .faq-item {
    position: relative;
    border-bottom: 1px dashed var(--color-blue-grey-300);
    font-size: 1rem;
    line-height: 1.4;
    color: var(--color-additional-dark);

    .tooltip {
      position: absolute;
      width: 48px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      right: 0;
      top: 0;
      background: var(--color-primary-300);
      color: var(--color-additional-light);
      @media screen and (max-width: 567px) {
        width: 24px;
        height: 12px;
        font-size: 8px;
      }
    }

    &:not(:last-child) {
      margin-bottom: calc(var(--prop-gap) * 2);
    }

    div[class^='Accordion__AccordionTitle'] {
      margin-bottom: var(--prop-gap);
      column-gap: calc(var(--prop-gap) / 2);
      & span {
        color: inherit;
        font-weight: 700;
        font-size: 1.25rem;
        font-family: Raleway;
      }
      @media screen and (max-width: 567px) {
        margin-right: 40px;
      }
    }

    div[class^='Accordion__AccordionBodyWrapper'] {
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

type LocationState = {
  isNestedInfo?: boolean;
};

const READ_ITEMS_KEY = 'new-wallet-read-faq';

const FaqComponent = (): React.ReactElement<void> => {
  const { currentChain } = useApi();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  const [readFaqItems, setReadFaqItems] = useState<string[]>(
    localStorage.getItem(READ_ITEMS_KEY)?.split(',') || [],
  );

  const onToggleItem = useCallback(
    (index: number) => (isOpen: boolean) => {
      setReadFaqItems((readFaqItems) => {
        if (!isOpen || readFaqItems.includes(index.toString())) {
          return readFaqItems;
        }
        localStorage.setItem(READ_ITEMS_KEY, [...readFaqItems, index].join(','));
        return [...readFaqItems, index.toString()];
      });
    },
    [],
  );

  const keys = Object.keys(state);

  return (
    <MainWrapperStyled>
      <WrapperContentStyled>
        {faqItems(currentChain.network, state).map(
          (item: Record<string, ReactNode>, i: number) => {
            return (
              <Accordion
                key={i}
                className="faq-item"
                isOpen={keys.length > 0 ? Boolean(item.defaultExpanded) : i === 0}
                title={
                  <>
                    {item.title}
                    {item.isNew && !readFaqItems.includes(i.toString()) && (
                      <span className="tooltip">NEW</span>
                    )}
                  </>
                }
                onToggle={onToggleItem(i)}
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
