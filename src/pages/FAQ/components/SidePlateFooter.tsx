import styled from 'styled-components';

export const SidePlateFooter = styled.div`
  display: none;

  @media screen and (min-width: 1025px) {
    display: block;
    margin-top: calc(var(--prop-gap) * 2);
  }
`;
