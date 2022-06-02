import React, { FC, useCallback, useState } from 'react';
import { Button, InputText, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { PriceRange } from './types';
import Accordion from '../Accordion/Accordion';

interface PricesFilterProps {
  onChange(value: PriceRange | undefined): void;
}

const PricesFilter: FC<PricesFilterProps> = ({ onChange }) => {
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();

  const onApply = useCallback(() => {
    if (minPrice && maxPrice) {
      onChange({ minPrice, maxPrice });
      return;
    }
    onChange(undefined);
  }, [minPrice, maxPrice]);

  const onChangeMinPrice = useCallback((value: string) => {
    setMinPrice(Number(value) || undefined);
  }, []);

  const onChangeMaxPrice = useCallback((value: string) => {
    setMaxPrice(Number(value) || undefined);
  }, []);

  const onPricesClear = useCallback(() => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    onChange(undefined);
  }, []);

  return (
    <Accordion
      title="Price"
      isOpen={true}
      isClearShow={!!minPrice && !!maxPrice}
      onClear={onPricesClear}
    >
      <PriceFilterWrapper>
        <PricesRangeWrapper>
          <InputText
            value={minPrice?.toString()}
            placeholder="Min"
            onChange={onChangeMinPrice}
          />
          <Text>to</Text>
          <InputText
            value={maxPrice?.toString()}
            placeholder="Max"
            onChange={onChangeMaxPrice}
          />
        </PricesRangeWrapper>
        <Button title="Apply" onClick={onApply} />
      </PriceFilterWrapper>
    </Accordion>
  );
};

const PriceFilterWrapper = styled.div`
  padding-top: var(--prop-gap);
  display: flex;
  flex-direction: column;
  row-gap: var(--prop-gap);
  button {
    width: 71px;
  }
`;

const PricesRangeWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
  align-items: center;
`;

export default PricesFilter;
