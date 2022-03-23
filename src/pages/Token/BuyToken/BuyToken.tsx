import React, { FC } from 'react';
import { Button } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { useFee } from '../../../hooks/useFee';
import { Price } from '../TokenDetail/Price';
import { Grey300 } from '../../../styles/colors';
import { Offer } from '../../../api/restApi/offers/types';

interface BuyTokenProps {
  offer?: Offer;
  onBuyClick(): void
}

export const BuyToken: FC<BuyTokenProps> = ({ offer, onBuyClick }) => {
  const { fee } = useFee();

  if (!offer) return null;

  return (<>
    <Price price={offer.price} fee={fee} bid={offer.auction?.priceStep} />
    <ButtonWrapper>
      <Button
        onClick={onBuyClick}
        role='primary'
        title='Buy'
        wide={true}
      />
    </ButtonWrapper>
    <Divider />
  </>);
};

const ButtonWrapper = styled.div`
  width: 200px;
  margin-top: 24px;
`;

const Divider = styled.div`
  margin: 24px 0;
  border-top: 1px dashed ${Grey300};
`;
