import { memo } from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@unique-nft/ui-kit';

import { ProgressBar } from '@app/components';
import { formatBlockNumber } from '@app/utils';

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
  const percent = ((balance || 0) / (pieces || 1)) * 100;

  return (
    <div className={className}>
      <Heading className="header" size="4">
        Сharacteristics
      </Heading>
      <Row>
        <Text size="m" weight="light" color="grey-500">
          Total minted fractions:
        </Text>
        <Text>{formatBlockNumber(pieces || 0)}</Text>
      </Row>
      <Row>
        <Text size="m" weight="light" color="grey-500">
          Owned fractions:
        </Text>
        <Text>{formatBlockNumber(balance || 0)}</Text>
      </Row>
      <Row>
        <Text size="m" weight="light" color="grey-500">
          Ownership percentage:
        </Text>
        <Text>{`${percent.toFixed(2)}%`}</Text>
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
