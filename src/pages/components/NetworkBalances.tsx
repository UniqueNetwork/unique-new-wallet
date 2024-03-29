import styled from 'styled-components';

import { NetworkType } from '@app/types';

import { Typography } from '../../components/Typography';

export type TNetworkBalances = {
  balanceFull?: string;
  balanceLocked?: string;
  balanceTransferable?: string;
  symbol: NetworkType;
};

const Wrapper = styled.div``;

const BalanceLocked = styled(Typography).attrs({
  appearance: 'block',
  color: 'grey-500',
  size: 's',
  weight: 'light',
})`
  &:not(:last-of-type) {
    margin-top: calc(var(--prop-gap) / 4);
  }
`;

export const NetworkBalances = ({
  balanceTransferable,
  balanceLocked,
  balanceFull,
  symbol,
}: TNetworkBalances) => {
  const calculateBalanceTransferable = () => {
    if (!Number(balanceTransferable)) {
      return 'no transferable';
    }
    if (balanceFull === balanceTransferable) {
      return 'all transferable';
    }
    return `${balanceTransferable} ${symbol} transferable`;
  };

  return (
    <Wrapper>
      <Typography appearance="block">
        {balanceFull || '0'} {symbol}
      </Typography>
      <BalanceLocked>{calculateBalanceTransferable()}</BalanceLocked>
      {Number(balanceLocked) ? (
        <BalanceLocked>{`${balanceLocked || 0} ${symbol} locked`}</BalanceLocked>
      ) : null}
    </Wrapper>
  );
};
