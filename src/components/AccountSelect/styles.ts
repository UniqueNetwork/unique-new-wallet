import styled, { css } from 'styled-components';

export const truncateText = css`
  box-sizing: border-box;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AccountWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;

  .unique-text {
    display: inline-block;
    vertical-align: middle;
    ${truncateText};
    line-height: 1.5;
  }
`;

export const AccountGroup = styled.div`
  max-width: calc(100% - 40px);
  width: 100%;
  margin-left: calc(var(--prop-gap) / 2);
`;

export const AddressCopy = styled.button.attrs({ type: 'button' })`
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
