import { GroupBase, StylesConfig } from 'react-select';

import { Account } from '@app/account';

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
