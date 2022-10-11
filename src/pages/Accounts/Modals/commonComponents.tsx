import styled from 'styled-components/macro';
import { Text } from '@unique-nft/ui-kit';

export const LabelText = styled(Text).attrs({
  appearance: 'block',
})`
  margin-bottom: calc(var(--prop-gap) / 4);

  &[class*='appearance-block'] {
    display: flex;
    align-items: center;
  }

  .icon {
    margin-left: 0.25em;
  }
`;

export const AdditionalText = styled(Text).attrs({
  appearance: 'block',
})`
  margin-bottom: var(--prop-gap);
`;

export const StepsTextStyled = styled(Text)`
  flex: 1 1 100%;
  padding-right: var(--prop-gap);

  @media screen and (min-width: 568px) {
    flex-basis: 0;
  }
`;

export const ButtonGroup = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--prop-gap);

  @media screen and (min-width: 320px) {
    flex-grow: 0;
    flex-wrap: nowrap;
  }
`;
