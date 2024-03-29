import { memo, useMemo } from 'react';
import styled from 'styled-components';

import { Heading, Typography, ProgressBar } from '@app/components';
import { formatLongNumber } from '@app/utils';

import { TBaseToken } from '../type';

interface FractionalInformationProps<T extends TBaseToken> {
  balance?: number;
  pieces?: number;
  className?: string;
}

const FractionalInformationComponent = <T extends TBaseToken>({
  balance,
  pieces,
  className,
}: FractionalInformationProps<T>) => {
  const percent = useMemo(() => {
    return ((balance || 0) / (pieces || 1)) * 100;
  }, [balance, pieces]);

  const percentText = useMemo(() => {
    if (percent < 0.01) {
      return '<0.01 %';
    }
    if (percent > 99.99 && percent < 100) {
      return '>99.99 %';
    }
    return `${percent.toFixed(2)} %`;
  }, [percent]);

  return (
    <div className={className}>
      <Heading className="header" size="4">
        Сharacteristics
      </Heading>
      <Row>
        <Typography size="m" weight="light" color="grey-500">
          Total minted fractions:
        </Typography>
        <Typography>{formatLongNumber(pieces || 0)}</Typography>
      </Row>
      <Row>
        <Typography size="m" weight="light" color="grey-500">
          Owned fractions:
        </Typography>
        <Typography>{formatLongNumber(balance || 0)}</Typography>
      </Row>
      <Row>
        <Typography size="m" weight="light" color="grey-500">
          Ownership percentage:
        </Typography>
        <Typography>{percentText}</Typography>
      </Row>
      <Row>
        <ProgressBar filledPercent={percent} height={14} />
      </Row>
    </div>
  );
};

const TokenInformationStyled = styled(FractionalInformationComponent)`
  .header {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: var(--prop-gap);
  }
`;

const Row = styled.div`
  margin-bottom: calc(var(--prop-gap) / 2);
  word-break: break-all;
  display: flex;
  gap: calc(var(--prop-gap) / 4);
`;

export const FractionalInformation = memo(TokenInformationStyled);
