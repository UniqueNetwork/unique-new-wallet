import styled from 'styled-components';

export const SocialNav = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: var(--prop-gap);

  a {
    &:not(:first-child) {
      margin-left: var(--prop-gap);
    }
  }
`;
