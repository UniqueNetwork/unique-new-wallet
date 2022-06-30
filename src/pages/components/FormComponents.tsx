import styled from 'styled-components';
import { Text } from '@unique-nft/ui-kit';

export const Form = styled.form``;

export const FormHeader = styled.div`
  margin-bottom: calc(var(--prop-gap) * 1.5);

  & > .unique-font-heading {
    margin-bottom: calc(var(--prop-gap) / 2);

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const FormBody = styled.div``;

export const FormWrapper = styled.div`
  @media screen and (min-width: 1024px) {
    width: 100%;
    max-width: 756px;
  }

  .unique-select,
  .unique-suggestion,
  .suggest-input,
  .unique-input-text,
  .unique-textarea-text {
    display: block;
    width: 100%;

    & > label {
      margin-bottom: var(--prop-gap);

      & + .additional-text {
        margin-top: calc(var(--prop-gap) * (-0.75));
      }
    }
  }

  .unique-alert {
    margin-bottom: calc(var(--prop-gap) * 1.5);
  }

  ${FormHeader},
  ${FormBody} {
    .unique-text[class*='weight-regular'] {
      font-weight: normal;
    }
  }
`;

export const FormRow = styled.div`
  margin-bottom: calc(var(--prop-gap) * 2);

  &.has_uploader {
    margin-bottom: calc(var(--prop-gap) * 2.5);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const UploadWidget = styled.div`
  .unique-text {
    &:first-of-type {
      margin-bottom: calc(var(--prop-gap) / 4);
    }
  }
`;

export const LabelText = styled(Text).attrs({
  color: 'additional-dark',
  size: 'm',
  weight: 'bold',
})`
  display: block;
  margin-bottom: var(--prop-gap);
  font-weight: 600;
`;

export const SuggestOption = styled.div`
  display: flex;
  align-items: center;

  & > img {
    margin-right: calc(var(--prop-gap) / 2);
  }
`;

export const AdditionalText = styled(Text).attrs({ size: 's', color: 'grey-500' })`
  margin-bottom: var(--prop-gap);
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > .unique-button {
    flex: 1 1 100%;

    @media screen and (min-width: 1024px) {
      flex: 0 0 auto;
      margin-right: var(--prop-gap);
    }

    &:not(:first-child) {
      margin-top: var(--prop-gap);

      @media screen and (min-width: 1024px) {
        margin-top: 0;
      }
    }
  }
`;
