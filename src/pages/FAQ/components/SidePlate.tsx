import styled from 'styled-components';

import { Plate } from './Plate';

export const SidePlate = styled(Plate)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 2) calc(var(--prop-gap) * 2.5);
  text-align: center;

  @media screen and (min-width: 1024px) {
    padding: calc(var(--prop-gap) * 2);
  }

  .unique-button {
    min-width: 50%;
  }
`;
