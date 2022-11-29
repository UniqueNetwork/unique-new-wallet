import styled, { css } from 'styled-components';
import { GroupBase, StylesConfig, Theme } from 'react-select';

import { Account } from '@app/account';

export const theme = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: 'var(--color-primary-100)',
    primary25: 'var(--color-primary-100)',
    primary50: 'var(--color-primary-100)',
    primary75: 'var(--color-primary-100)',
  },
});

export const styles: StylesConfig<Account, false, GroupBase<Account>> = {
  control: (css) => ({
    ...css,
    padding: 'calc(var(--prop-gap) / 4) var(--prop-gap)',
    height: 'calc(var(--prop-gap) * 4)',
    borderColor: 'var(--color-grey-300)',
    boxShadow: 'none',
    '&:hover, &:focus-within': {
      borderColor: 'var(--color-blue-grey-400)',
    },
  }),
  valueContainer: (css) => ({ ...css, padding: 0 }),
  clearIndicator: (css) => ({
    ...css,
    padding: 0,
    marginRight: 'calc(var(--prop-gap) / 2)',
  }),
  dropdownIndicator: (css) => ({
    ...css,
    padding: 0,
  }),
  menu: (css) => ({
    ...css,
    border: '1px solid var(--color-grey-300)',
    boxShadow: 'none',
  }),
  option: (css) => ({
    ...css,
    padding: 'calc(var(--prop-gap) / 4) var(--prop-gap)',
  }),
  placeholder: (css) => ({
    ...css,
    marginLeft: 0,
    color: 'var(--color-grey-400)',
    fontWeight: 'var(--prop-font-weight)',
    fontFamily: 'var(--prop-font-family)',
    fontSize: 'calc(var(--prop-font-size) + 2px)',
  }),
  input: (css) => ({
    ...css,
    width: 0,
    marginLeft: 0,
    color: 'var(--color-additional-dark)',
    fontSize: 'calc(var(--prop-font-size) + 2px)',
  }),
  singleValue: (css) => ({
    ...css,
    marginLeft: 0,
  }),
};

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

  .address-text {
    line-height: 22px;
    padding-right: 1.5rem;
  }

  ${AddressCopy} {
    margin-bottom: -0.2em;
    margin-left: -1rem;
  }
`;
