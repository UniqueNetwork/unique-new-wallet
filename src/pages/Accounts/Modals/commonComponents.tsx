import styled from 'styled-components/macro';
import { Text } from '@unique-nft/ui-kit';

export const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: calc(var(--prop-gap) * 2);

  .unique-input-text {
    width: 100%;
  }
`;

export const LabelText = styled(Text)`
  margin-bottom: calc(var(--prop-gap) / 4);

  .unique-tooltip-content {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.25em;
    margin-bottom: -0.25em;
  }
`;

export const AdditionalText = styled(Text)`
  margin-bottom: var(--prop-gap);
`;

export const ModalHeader = styled.div`
  margin-bottom: calc(var(--prop-gap) * 1.5);

  && h2 {
    margin-bottom: 0;
  }
`;

export const ModalContent = styled.div``;

export const ModalFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
`;

export const TextWarning = styled(Text)`
  border-radius: var(--prop-border-radius);
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  background-color: var(--color-additional-warning-100);
`;

export const AddressWrapper = styled.div`
  border: 1px solid var(--color-grey-300);
  border-radius: var(--prop-border-radius);
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
  padding: 20px var(--prop-gap);
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

  @media screen and (min-width: 320px) {
    flex-grow: 0;
    flex-wrap: nowrap;
  }

  .unique-button {
    margin-top: var(--prop-gap);

    @media screen and (min-width: 320px) {
      margin-top: 0;
    }

    & + .unique-button {
      @media screen and (min-width: 320px) {
        margin-left: var(--prop-gap);
      }
    }
  }
`;
