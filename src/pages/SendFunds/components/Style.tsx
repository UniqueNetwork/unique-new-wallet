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
