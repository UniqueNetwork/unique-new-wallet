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

  .unique-modal {
    overflow: visible;
  }
`;
