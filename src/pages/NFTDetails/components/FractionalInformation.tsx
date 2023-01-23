import { memo } from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@unique-nft/ui-kit';

import { useTokenGetTotalPieces } from '@app/api/restApi/token/useTokenGetTotalPieces';
import { useTokenGetBalance } from '@app/api/restApi/token/useTokenGetBalance';
import { useAccounts } from '@app/hooks';
import { ProgressBar } from '@app/components';

import { TBaseToken } from '../type';

interface FractionalInformationProps<T extends TBaseToken> {
  token?: T;
  className?: string;
}

const FractionalInformationComponent = <T extends TBaseToken>({
  token,
  className,
}: FractionalInformationProps<T>) => {
  const { selectedAccount } = useAccounts();

  const { data: pieces } = useTokenGetTotalPieces({
    tokenId: token?.tokenId,
    collectionId: token?.collectionId,
  });

  const { data: balance } = useTokenGetBalance({
    tokenId: token?.tokenId,
    collectionId: token?.collectionId,
    address: selectedAccount?.address,
  });

  const percent = ((balance?.amount || 0) / (pieces?.amount || 1)) * 100;

  return (
    <div className={className}>
      <Heading className="header" size="4">
        Сharacteristics
      </Heading>
      <Row>
        <Text size="m" weight="light" color="grey-500">
          Total minted fractions:
        </Text>
        <Text>{pieces?.amount || 0}</Text>
      </Row>
      <Row>
        <Text size="m" weight="light" color="grey-500">
          Owned fractions:
        </Text>
        <Text>{balance?.amount || 0}</Text>
      </Row>
      <Row>
        <Text size="m" weight="light" color="grey-500">
          Ownership percentage:
        </Text>
        <Text>{`${percent.toFixed(0)}%`}</Text>
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
