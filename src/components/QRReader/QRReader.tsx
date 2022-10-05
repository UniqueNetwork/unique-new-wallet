import React, { FC, useCallback } from 'react';
import styled from 'styled-components/macro';
import { decodeAddress } from '@polkadot/util-crypto';
import { QrReader } from 'react-qr-reader';
import Result from '@zxing/library/esm/core/Result';

export interface ScannedResult {
  content: string;
  genesisHash: string;
  isAddress: boolean;
  name?: string;
}

interface QRReaderProps {
  isEthereum?: boolean;
  onScan(scanned: ScannedResult): void;
}

const defaultDelay = 150;
const ADDRESS_PREFIX = 'substrate';
const SEED_PREFIX = 'secret';

export const QRReader: FC<QRReaderProps> = ({ isEthereum, onScan }) => {
  const _onScan = useCallback(
    (data: Result | null | undefined) => {
      if (!data) {
        return;
      }

      const text = data.getText();
      let prefix: string, content: string, genesisHash: string, name: string[];

      if (!isEthereum) {
        [prefix, content, genesisHash, ...name] = text.split(':');
      } else {
        [prefix, content, ...name] = text.split(':');
        genesisHash = '';
        content = content.substring(0, 42);
      }

      const expectedPrefix = isEthereum ? 'ethereum' : ADDRESS_PREFIX;
      const isValidPrefix = prefix === expectedPrefix || prefix === SEED_PREFIX;

      if (!isValidPrefix) {
        throw new Error(
          `Invalid prefix received, expected '${expectedPrefix} or ${SEED_PREFIX}' , found '${prefix}'`,
        );
      }

      const isAddress = prefix === expectedPrefix;

      if (isAddress && !isEthereum) {
        decodeAddress(content);
      }

      onScan({
        content,
        genesisHash,
        isAddress,
        name: name?.length ? name.join(':') : undefined,
      });
    },
    [isEthereum, onScan],
  );

  return (
    <QRReaderWrapper>
      <QrReader
        scanDelay={defaultDelay}
        constraints={{
          facingMode: 'environment',
        }}
        onResult={_onScan}
      />
    </QRReaderWrapper>
  );
};

const QRReaderWrapper = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 362px;
  max-height: 362px;
  margin: 0 auto;
  background-color: var(--color-blue-grey-100);

  &::before {
    box-sizing: border-box;
    border: 5px solid var(--color-coral-400);
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 100%;
    height: 100%;
    content: '';
    transform: translate3d(-50%, -50%, 0);

    @media screen and (min-width: 1024px) {
      width: 80%;
      height: 80%;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  video {
    object-fit: cover;
  }
`;
