import styled from 'styled-components';

export const SocialNav = styled.nav`
  display: flex;
  justify-content: center;
  gap: var(--prop-gap);
  margin-top: var(--prop-gap);

  a {
    color: var(--color-primary-500);

    &:hover {
      opacity: 0.9;
    }
  }
`;
