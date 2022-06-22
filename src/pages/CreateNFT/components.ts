import styled, { css } from 'styled-components';
import { Text } from '@unique-nft/ui-kit';

export const commonPlateCss = css`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: var(--prop-border-radius);
  padding: calc(var(--prop-gap) * 2);
  background-color: var(--color-additional-light);
`;

export const MainWrapper = styled.div`
  @media screen and (min-width: 1024px) {
    display: flex;
    align-items: flex-start;
  }
`;

export const WrapperContent = styled.div`
  box-sizing: border-box;
  flex: 1 1 66.6666%;

  @media screen and (min-width: 1024px) {
    ${commonPlateCss};
  }
`;

export const WrapperSidebar = styled.aside`
  box-sizing: border-box;
  flex: 1 1 33.3333%;
  max-width: 600px;
  margin-left: calc(var(--prop-gap) * 2);

  @media screen and (min-width: 1024px) {
    ${commonPlateCss};
  }
`;

export const SidebarRow = styled.div`
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;

export const PreviewCard = styled.div`
  display: flex;

  .unique-text {
    display: block;
  }

  .unique-avatar {
    outline: none;
    background-color: #f5f6f7;

    &.square {
      border-radius: var(--prop-border-radius);
    }
  }

  ._empty-picture {
    .unique-avatar {
      object-fit: none;
    }
  }
`;

export const PreviewCardInfo = styled.div`
  flex: 1 1 auto;
  padding-left: var(--prop-gap);
`;

export const PreviewCardTitle = styled.h5`
  font-size: 1.125rem;
  line-height: 1.5;
`;

export const PreviewCardDescription = styled(Text)`
  &:not(:last-child) {
    margin-bottom: var(--prop-gap);
  }

  &.unique-text {
    font-weight: 400;
  }
`;

export const PreviewCardAttributes = styled.div``;

export const AttributesGroup = styled.div`
  & {
    overflow: hidden;
  }

  &:not(:first-of-type),
  & > * {
    margin-top: calc(var(--prop-gap) / 2);
  }

  .unique-tag {
    margin-right: calc(var(--prop-gap) / 2);
    cursor: auto;
  }
`;

export const LabelText = styled(Text).attrs({
  color: 'additional-dark',
  size: 'm',
  weight: 'bold',
})`
  display: block;
  margin-bottom: calc(var(--prop-gap) / 4);
  font-weight: 600;
`;

export const AdditionalText = styled(Text).attrs({ size: 's', color: 'grey-500' })`
  margin-bottom: var(--prop-gap);
`;

export const UploadWidget = styled.div``;

export const SuggestOption = styled.div`
  display: flex;
  align-items: center;

  & > img {
    margin-right: calc(var(--prop-gap) / 2);
  }
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

export const Form = styled.form`
  width: 100%;
  max-width: 756px;

  .unique-select,
  .unique-suggestion,
  .suggest-input {
    display: block;
    width: 100%;
  }

  .unique-input-text {
    display: block;
    width: 100%;

    & > label {
      margin-bottom: var(--prop-gap);
    }
  }

  .unique-alert {
    margin-bottom: calc(var(--prop-gap) * 1.5);
  }

  .unique-font-heading {
    &:not(:first-child) {
      margin-top: calc(var(--prop-gap) * 2.5);
    }
  }
`;

export const FormRow = styled.div`
  &:not(:last-child) {
    margin-bottom: calc(var(--prop-gap) * 2);
  }
`;
