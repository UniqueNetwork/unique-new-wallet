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

export const ModalHeader = styled.div`
  margin-bottom: calc(var(--prop-gap) * 1.5);

  && h2 {
    margin-bottom: 0;
  }
`;

export const AddressWrapper = styled.div`
  border: 1px solid var(--color-grey-300);
  border-radius: var(--prop-border-radius);
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
  min-height: 24px;
  padding: 20px var(--prop-gap);
  color: var(--color-grey-400);
`;

export const AddressText = styled(Text).attrs({ appearance: 'block', size: 's' })`
  &.unique-text {
    color: inherit;
    line-height: 24px;
  }
`;

export const StepsTextStyled = styled(Text)`
  flex-grow: 1;
  padding-right: var(--prop-gap);
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
