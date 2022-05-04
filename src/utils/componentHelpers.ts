export interface Option {
  id: string;
  [x: string | number | symbol]: unknown;
}

export const sortIcon = {
  size: 12,
  color: 'var(--color-additional-dark)',
};

export const iconDown = {
  ...sortIcon,
  name: 'arrow-down',
};

export const iconUp = {
  ...sortIcon,
  name: 'arrow-up',
};
