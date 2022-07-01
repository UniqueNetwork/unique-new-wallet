import styled, { css } from 'styled-components';

import { NetworkType } from '@app/types';

export type TNetworkBalances = {
  balanceFull?: string;
  balanceLocked?: string;
  balanceTransferable?: string;
  symbol: NetworkType;
};

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
    <NetworkBalancesWrapper>
      <div className="balance-full">
        {balanceFull || '0'} {symbol}
      </div>
      <div className="balance-transferable">{calculateBalanceTransferable()}</div>
      {Number(balanceLocked) ? (
        <div className="balance-locked">{`${balanceLocked} ${symbol} locked`}</div>
      ) : null}
    </NetworkBalancesWrapper>
  );
};

const Bold = css`
  font-family: var(--prop-font-family);
  font-size: 16px;
  font-weight: 500;
`;

const BoldMargin4 = css`
  ${Bold};
  margin-bottom: calc(var(--prop-gap) / 4);
`;

const NetworkBalancesWrapper = styled.div`
  .balance-full {
    min-width: 300px;
    ${BoldMargin4};
    color: var(--color-secondary-500);
  }

  .balance-transferable,
  .balance-locked {
    color: var(--color-grey-500);
    line-height: 22px;
  }
`;
