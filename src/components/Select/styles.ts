import { GroupBase, StylesConfig, Theme } from 'react-select';

import { Option } from './Select';

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

export const styles: StylesConfig<Option, false, GroupBase<any>> = {
  control: (css) => ({
    ...css,
    padding: '7px var(--prop-gap)',
    height: 'calc(var(--prop-gap) * 2.5)',
    borderColor: 'var(--color-grey-300)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--color-grey-300)',
    },
    '&:focus-within': {
      borderColor: 'var(--color-grey-400)',
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
  option: (css) => ({
    ...css,
    color: 'inherit',
  }),
};
