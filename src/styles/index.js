import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Constants */
    --gap: 16px;
    
    --prop-container-width: 1900px;
  }

  /* reset default browser css */
  a {
    text-decoration: none;
  }

  .unique-modal {
    overflow: visible;
  }
`;
