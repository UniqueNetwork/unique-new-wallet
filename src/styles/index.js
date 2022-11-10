import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Constants */
    --gap: 16px;

    --prop-container-width: 1900px;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  /* reset default browser css */
  a {
    text-decoration: none;
  }

  .unique-tooltip {
    z-index: 1100;
  }

  .unique-font-heading {
    font-feature-settings: 'pnum' on, 'lnum' on;
  }

  .unique-button.with-icon {
    &.unique-button-icon {
      box-sizing: border-box;
      border-radius: calc(var(--prop-border-radius) * 2);
      margin: 0;
      padding: calc(var(--prop-gap) / 2);

      &:not(.ghost):not(.negative),
      &.outlined {
        border-color: var(--color-blue-grey-300);
        background-color: var(--color-additional-light);
        color: var(--color-secondary-400);

        &:hover,
        &:active {
          border-color: var(--color-blue-grey-300);
          background-color: var(--color-blue-grey-100);
          color: var(--color-secondary-400);
        }
      }

      & > svg.icon {
        margin: 0;
      }
    }
  }
  
  .dropdown-wrapper.dropped {
    .unique-button.with-icon {
      &.unique-button-icon {
        &:not(.ghost),
        &.outlined {
          background-color: var(--color-blue-grey-100);
        }

        &:not(.ghost).negative {
          background-color: var(--color-secondary-400);
        }
      }
    }
  }
`;
