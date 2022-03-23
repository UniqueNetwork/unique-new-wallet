import React, { FC } from 'react';
import { Heading, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { Icon } from '../../../components/Icon/Icon';
import Kusama from '../../../static/icons/logo-kusama.svg';
import { formatKusamaBalance } from '../../../utils/textUtils';

interface PriceProps {
  price: string;
  fee: number;
  bid?: string;
}

const tokenSymbol = 'KSM';

export const Price: FC<PriceProps> = ({ price, fee, bid }) => {
  return (
    <PriceWrapper>
      <Row>
        <Icon path={Kusama} />
        <Heading size={'1'}>{`${(Number(formatKusamaBalance(price)) + fee).toPrecision()}`}</Heading>
      </Row>
      <Row>
        <Text color='grey-500' size='m'>
          {`${bid ? `Bid: ${formatKusamaBalance(bid)}` : `Price: ${formatKusamaBalance(price)}`} ${tokenSymbol}`}
        </Text>
      </Row>
      <Row>
        <Text color='grey-500' size='m'>
          {`Network fee: ${fee} ${tokenSymbol}`}
        </Text>
      </Row>
    </PriceWrapper>
  );
};

const PriceWrapper = styled.div`
  
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  column-gap: calc(var(--gap) / 2);
  && h1 {
    margin-bottom: 0;
  }
`;
