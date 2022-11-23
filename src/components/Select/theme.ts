import { Theme } from 'react-select';

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
