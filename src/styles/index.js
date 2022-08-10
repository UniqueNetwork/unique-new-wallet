import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Constants */
    --gap: 16px;
  }

  /* reset default browser css */
  a {
    text-decoration: none;
  }

  .unique-modal {
    overflow: visible;
  }
`;
