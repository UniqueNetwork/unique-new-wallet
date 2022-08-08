import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { Accordion } from '@unique-nft/ui-kit';

import { usePageSettingContext } from '@app/context';
import {
  MainWrapper,
  WrapperContent,
  WrapperSidebar,
} from '@app/pages/components/PageComponents';

import { faqItems, AskQuestion } from './components';

const WrapperContentStyled = styled(WrapperContent)`
  padding-bottom: calc(var(--prop-gap) * 2);

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

export const Faq = (): React.ReactElement<void> => {
  const { setPageBreadcrumbs, setPageHeading } = usePageSettingContext();

  useEffect(() => {
    setPageBreadcrumbs({ options: [] });
    setPageHeading('FAQ');
  }, []);

  return (
    <MainWrapper>
      <WrapperContentStyled>
        {faqItems.map((item, i) => {
          return (
            <Accordion key={i} className="faq-item" expanded={i === 0} title={item.title}>
              {item.content}
            </Accordion>
          );
        })}
      </WrapperContentStyled>
      <WrapperSidebar>
        <AskQuestion />
      </WrapperSidebar>
    </MainWrapper>
  );
};

export default Faq;
