import React, { FC } from 'react';
import { Text, Table, Link } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { Offer } from '../../../api/restApi/offers/types';
import { TableColumnProps } from '@unique-nft/ui-kit/dist/cjs/types';
import { timestampTableFormat } from '../../../utils/timestampUtils';
import { formatKusamaBalance, shortcutText } from '../../../utils/textUtils';

interface BidsProps {
  offer: Offer
}

const getColumns = (tokenSymbol: string): TableColumnProps[] => ([
  {
    title: 'Bid',
    field: 'amount',
    width: '100%',
    render: (bid: string) => <Text color={'dark'}>{`${formatKusamaBalance(bid)} ${tokenSymbol}`}</Text>
  },
  {
    title: 'Time',
    field: 'createdAt',
    width: '100%',
    render: (createdAt: string) => timestampTableFormat(new Date(createdAt).valueOf())
  },
  {
    title: 'Bidder',
    field: 'bidderAddress',
    width: '100%',
    render: (account: string) => <Link href={`/account/${account}`} title={shortcutText(account)} />
  }
]);

const tokenSymbol = 'KSM';

const Bids: FC<BidsProps> = ({ offer }) => {
  if (!offer) return null;

  return (
    <BidsWrapper>
      {!offer.auction?.bids?.length && <Text >There is no bids</Text>}
      {offer.auction?.bids?.length && <Table
        data={offer.auction?.bids}
        columns={getColumns(tokenSymbol)}
      />}
    </BidsWrapper>
  );
};

export default Bids;

const BidsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--gap) * 1.5);
  margin-bottom: calc(var(--gap) * 1.5);
`;
