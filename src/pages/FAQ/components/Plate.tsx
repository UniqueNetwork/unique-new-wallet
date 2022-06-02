import styled from 'styled-components/macro';

export const Plate = styled.div`
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
