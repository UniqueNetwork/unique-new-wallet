export const shortcutText = (text: string) => {
  // Cut it to the first and last 5 symbols
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, start, end] = /^(.{5}).*(.{5})$/.exec(text) || [];

  return start && end ? `${start}...${end}` : text;
};

export const formatLongNumber = (number = 0): string => {
  if (!number) {
    return '0';
  }

  if (number < 10000) {
    return formatBlockNumber(number);
  }

  if (number < 1000000) {
    return formatBlockNumber(Math.floor(number / 100) / 10) + 'K';
  }

  if (number < 1000000000) {
    return formatBlockNumber(Math.floor(number / 100000) / 10) + 'M';
  }

  return formatBlockNumber(Math.floor(number / 100000000) / 10) + 'B';
};

export const formatAmount = (amount: number | string, initialValue = '0') => {
  if (!amount) {
    return initialValue;
  }
  const parts = amount.toString().split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
};

export const formatBlockNumber = (blockNumber: number | string | undefined) => {
  if (!blockNumber) {
    return '';
  }

  return blockNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatKusamaBalance = (balance: string | number, decimals = 12) => {
  const balanceValue = Number(balance);
  return (balanceValue / Math.pow(10, decimals)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};
