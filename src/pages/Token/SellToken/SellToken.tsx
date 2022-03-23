import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Button } from '@unique-nft/ui-kit';

import { AdditionalWarning100, AdditionalWarning500, Grey300 } from '../../../styles/colors';
import { useFee } from '../../../hooks/useFee';
import { Price } from '../TokenDetail/Price';
import { Offer } from '../../../api/restApi/offers/types';

interface SellTokenProps {
  offer?: Offer
  onSellClick(): void
  onTransferClick(): void
  onDelistClick(): void
}

export const SellToken: FC<SellTokenProps> = ({ offer, onSellClick, onTransferClick, onDelistClick }) => {
  const { fee } = useFee();

  if (offer) {
    return (<>
      <Price price={offer.price} fee={fee} bid={offer.auction?.priceStep} />
      <ButtonWrapper>
        <Button title={'Delist'} role={'danger'} onClick={onDelistClick} />
      </ButtonWrapper>
      <Divider />
    </>);
  }

  return (
    <>
      <ActionsWrapper>
        <Button title={'Sell'} role={'primary'} onClick={onSellClick}/>
        <Button title={'Transfer'} onClick={onTransferClick} />
      </ActionsWrapper>
      <WarningWrapper>
        A fee of ~0,001 KSM may be applied to the first sale transaction. Your address will be added to the transaction sponsoring whitelist allowing you to make feeless transactions.
      </WarningWrapper>
      <Divider />
    </>
  );
};

const ActionsWrapper = styled.div`
  display: flex;
  column-gap: var(--gap);
`;

const WarningWrapper = styled.div`
  background: ${AdditionalWarning100};
  color: ${AdditionalWarning500};
  border-radius: 4px;
  padding: calc(var(--gap) / 2) var(--gap);
  margin-top: var(--gap);
`;

const ButtonWrapper = styled.div`
  width: 200px;
  margin-top: calc(var(--gap) * 1.5);
`;

const Divider = styled.div`
  margin: calc(var(--gap) * 1.5) 0;
  border-top: 1px dashed ${Grey300};
`;
