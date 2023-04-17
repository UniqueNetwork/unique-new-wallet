import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

import { Statuses } from './types';
import { Accordion } from '../Accordion';
import { Checkbox } from '../Checkbox';

interface StatusFilterProps {
  onChange(value: Statuses): void;
}

const StatusFilter: FC<StatusFilterProps> = ({ onChange }) => {
  const [myNFTs, setMyNFTs] = useState<boolean>(false);
  const [fixedPrice, setFixedPrice] = useState<boolean>(false);
  const [timedAuction, setTimedAuction] = useState<boolean>(false);
  const [myBets, setMyBets] = useState<boolean>(false);

  const onMyNFTsChange = useCallback(
    (value: boolean) => {
      onChange({ myNFTs: value, fixedPrice, timedAuction, myBets });
      setMyNFTs(value);
    },
    [fixedPrice, timedAuction, myBets],
  );

  const onFixedPriceChange = useCallback(
    (value: boolean) => {
      onChange({ myNFTs, fixedPrice: value, timedAuction, myBets });
      setFixedPrice(value);
    },
    [myNFTs, timedAuction, myBets],
  );

  const onTimedAuctionChange = useCallback(
    (value: boolean) => {
      onChange({ myNFTs, fixedPrice, timedAuction: value, myBets });
      setTimedAuction(value);
    },
    [myNFTs, fixedPrice, myBets],
  );

  const onMyBetsChange = useCallback(
    (value: boolean) => {
      onChange({ myNFTs, fixedPrice, timedAuction, myBets: value });
      setMyBets(value);
    },
    [myNFTs, fixedPrice, timedAuction, onChange],
  );

  const onClear = useCallback(() => {
    setMyNFTs(false);
    setFixedPrice(false);
    setTimedAuction(false);
    setMyBets(false);
    onChange({ myNFTs: false, fixedPrice: false, timedAuction: false, myBets: false });
  }, [onChange]);

  return (
    <Accordion
      title="Status"
      isOpen={true}
      isClearShow={myNFTs || fixedPrice || timedAuction || myBets}
      onClear={onClear}
    >
      <StatusFilterWrapper>
        <Checkbox
          checked={myNFTs}
          label="My NFTs on sell"
          size="m"
          onChange={onMyNFTsChange}
        />
        <Checkbox
          checked={fixedPrice}
          label="Fixed price"
          size="m"
          onChange={onFixedPriceChange}
        />
        <Checkbox
          checked={timedAuction}
          label="Timed auction"
          size="m"
          onChange={onTimedAuctionChange}
        />
        <Checkbox checked={myBets} label="My bets" size="m" onChange={onMyBetsChange} />
      </StatusFilterWrapper>
    </Accordion>
  );
};

const StatusFilterWrapper = styled.div`
  padding-top: var(--prop-gap);
  display: flex;
  flex-direction: column;
  row-gap: var(--prop-gap);
`;

export default StatusFilter;
