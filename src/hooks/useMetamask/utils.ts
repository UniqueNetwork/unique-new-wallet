export const amountToBnString = (value: string, decimals: number): string => {
  if (!value || !value.length) {
    return '0';
  }

  const numStringValue = value.replace(',', '.');
  const [left, right] = numStringValue.split('.');
  const decimalsFromLessZeroString = right?.length || 0;
  const bigValue = [...(left || []), ...(right || [])].join('').replace(/^0+/, '');
  return (
    Number(bigValue) * Math.pow(10, decimals - decimalsFromLessZeroString)
  ).toString();
};
