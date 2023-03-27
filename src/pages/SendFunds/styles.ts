import styled from 'styled-components';

import { AdditionalText } from '@app/pages/Accounts/Modals/commonComponents';

export const Group = styled.div`
  &:not(:first-child) {
    margin-top: var(--prop-gap);
  }

  & > .unique-text:not(:first-child) {
    display: block;
    margin-top: calc(var(--prop-gap) / 2);
    text-align: right;
  }
`;

export const StyledAdditionalText = styled(AdditionalText)`
  margin-bottom: calc(var(--prop-gap) / 2);
`;

export const InputAmount = styled.div`
  position: relative;

  .unique-input-text div.input-wrapper input[type='text'],
  .unique-input-text div.input-wrapper.with-icon.to-right input[type='text'] {
    width: calc(100% - 76px);
    color: var(--color-additional-dark);
    padding: 8px 16px;
  }
`;

export const InputAmountButton = styled.button`
  border: 0;
  position: absolute;
  top: 50%;
  right: calc(var(--prop-gap) / 2);
  padding: calc(var(--prop-gap) / 2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: 0 transparent;
  line-height: 1;
  color: var(--color-primary-500);
  font: inherit;
  font-weight: 500;
  font-size: calc(var(--prop-font-size) + 2px);
  transform: translate3d(0, -50%, 0);
  cursor: pointer;

  &:disabled {
    color: var(--color-blue-grey-300);
  }
`;

export const TotalLoader = styled.span`
  .unique-loader {
    .loader {
      width: calc(var(--prop-gap) * 1.375);
      height: calc(var(--prop-gap) * 1.375);
    }

    .loader-label {
      color: var(--color-additional-dark);
    }
  }
`;

export const FeeLoader = styled.span`
  .unique-loader {
    .loader {
      width: calc(var(--prop-gap) * 1.375);
      height: calc(var(--prop-gap) * 1.375);
      border-top-color: var(--color-additional-warning-500);
      border-left-color: var(--color-additional-warning-500);
    }

    .loader-label {
      font-size: var(--prop-font-size);
      font-weight: calc(var(--prop-font-weight) + 100);
      color: var(--color-additional-warning-500);
    }
  }
`;
