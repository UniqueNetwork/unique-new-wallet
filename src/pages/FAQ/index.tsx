import React from 'react';
import styled from 'styled-components/macro';
import { Accordion, Heading } from '@unique-nft/ui-kit';

import { faqItems, Plate } from './components';

export const Faq = (): React.ReactElement<void> => {
  return (
    <>
      <Heading size="1">FAQ</Heading>
      <MainWrapper>
        <WrapperContent>
          <Plate>
            {faqItems.map((item, i) => {
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
            })}
          </Plate>
        </WrapperContent>
        {/* https://cryptousetech.atlassian.net/browse/WMS-901 */}
        {/* <AskQuestion /> */}
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

export default Faq;
