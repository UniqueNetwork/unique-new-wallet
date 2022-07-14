import styled, { css } from 'styled-components';

import { AdditionalText } from '@app/pages/Accounts/Modals/commonComponents';

export const truncateText = css`
  box-sizing: border-box;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

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

export const AccountWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  width: 100%;

  .unique-text {
    display: inline-block;
    vertical-align: middle;
    ${truncateText};
    line-height: 1.5;
  }

  img {
    margin-right: var(--prop-gap);
  }
`;

export const AccountGroup = styled.div`
  max-width: calc(100% - 40px);
  width: 100%;
`;

export const AddressCopy = styled.button`
  appearance: none;
  border: 0 none;
  border-radius: 0;
  vertical-align: middle;
  padding: 0;
  color: inherit;
  background: none;
  cursor: pointer;

  &:hover {
    color: var(--color-grey-600);
  }
`;

export const AccountAddress = styled.div`
  color: var(--color-grey-500);

  .unique-text {
    padding-right: 1.5rem;
  }

  ${AddressCopy} {
    margin-bottom: -0.2em;
    margin-left: -1rem;
  }
`;

export const AccountContainer = styled.div`
  box-sizing: border-box;
  border-radius: var(--prop-border-radius);
  border: 1px solid var(--color-grey-300);
  position: relative;
  background-color: var(--color-additional-light);
`;

export const AccountSelectWrapper = styled(AccountContainer)`
  padding-right: calc(var(--prop-gap) * 2.5);
  user-select: none;

  &:after {
    border-style: solid;
    border-width: 5px;
    border-color: var(--color-blue-grey-400) transparent transparent transparent;
    position: absolute;
    top: 50%;
    right: var(--prop-gap);
    width: 0;
    height: 0;
    content: '';
  }
`;

export const AccountSelect = styled.div`
  .unique-dropdown {
    width: 100%;
    z-index: 100;

    .dropdown-options,
    .dropdown-option {
      box-sizing: border-box;
      width: 100%;
      padding: 0;
      line-height: normal;
    }
  }
`;

export const InputAmount = styled.div`
  position: relative;

  input[type='text'] {
    width: calc(100% - 76px);
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
  transform: translate3d(0, -50%, 0);
  cursor: pointer;
`;
