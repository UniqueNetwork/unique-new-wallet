import React, { FC, useCallback, useState } from 'react';
import { Checkbox } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { MyTokensStatuses } from './types';
import Accordion from '../../../components/Accordion/Accordion';

interface StatusFilterProps {
  onChange(value: MyTokensStatuses): void
}

const StatusFilter: FC<StatusFilterProps> = ({ onChange }) => {
  const [onSell, setOnSell] = useState<boolean>(false);
  const [fixedPrice, setFixedPrice] = useState<boolean>(false);
  const [timedAuction, setTimedAuction] = useState<boolean>(false);
  const [notOnSale, setNotOnSale] = useState<boolean>(false);
  const onMyNFTsOnSellChange = useCallback((value: boolean) => {
    onChange({ onSell: value, fixedPrice, timedAuction, notOnSale });
    setOnSell(value);
  }, [fixedPrice, timedAuction, notOnSale, onChange]);

  const onFixedPriceChange = useCallback((value: boolean) => {
    onChange({ onSell, fixedPrice: value, timedAuction, notOnSale });
    setFixedPrice(value);
  }, [onSell, timedAuction, notOnSale, onChange]);

  const onTimedAuctionChange = useCallback((value: boolean) => {
    onChange({ onSell, fixedPrice, timedAuction: value, notOnSale });
    setTimedAuction(value);
  }, [onSell, fixedPrice, notOnSale, onChange]);

  const onNotOnSaleChange = useCallback((value: boolean) => {
    onChange({ onSell, fixedPrice, timedAuction, notOnSale: value });
    setNotOnSale(value);
  }, [onSell, fixedPrice, timedAuction, onChange]);

  const onClear = useCallback(() => {
    setOnSell(false);
    setFixedPrice(false);
    setTimedAuction(false);
    setNotOnSale(false);
    onChange({ onSell: false, fixedPrice: false, timedAuction: false, notOnSale: false });
  }, [onChange]);

  return (
    <Accordion title={'Status'}
      isOpen={true}
      onClear={onClear}
      isClearShow={onSell || fixedPrice || timedAuction || notOnSale}
    >
      <StatusFilterWrapper>
        <Checkbox
          checked={onSell}
          label={'My NFTs on sell'}
          size={'m'}
          onChange={onMyNFTsOnSellChange}
        />
        <Checkbox
          checked={fixedPrice}
          label={'Fixed price'}
          size={'m'}
          onChange={onFixedPriceChange}
        />
        <Checkbox
          checked={timedAuction}
          label={'Timed auction'}
          size={'m'}
          onChange={onTimedAuctionChange}
        />
        <Checkbox
          checked={notOnSale}
          label={'Not on sale'}
          size={'m'}
          onChange={onNotOnSaleChange}
        />
      </StatusFilterWrapper>
    </Accordion>
  );
};

const StatusFilterWrapper = styled.div`
  padding-top: var(--gap);
  display: flex;
  flex-direction: column;
  row-gap: var(--gap);
`;

export default StatusFilter;
