import { FC, useMemo, useState } from 'react';
import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { useRestApi } from '@app/hooks';
import { NFTToken } from '@app/types';
import { formatKusamaBalance } from '@app/utils/textUtils';

import Loading from '../Loading';
import { Picture } from '..';
import config from '../../config';

export type TTokensCard = {
  token?: NFTToken;
  tokenId?: number;
  collectionId?: number;
  price?: string;
  tokenImageUrl?: string;
};

export const TokensCard: FC<TTokensCard> = ({
  collectionId,
  tokenId,
  price,
  ...props
}) => {
  const [token, setToken] = useState<NFTToken | undefined>(props.token);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const restApi = useRestApi();

  const { collectionName, imagePath, tokenPrefix } = useMemo<
    Record<string, string | undefined>
  >(() => {
    if (token) {
      return {
        collectionName: token.collectionName,
        imagePath: token.imageUrl,
        tokenPrefix: token.prefix,
      };
    }

    if (tokenId && collectionId) {
      setIsFetching(true);

      /* void restApi?.getToken(collectionId, tokenId).then((token: NFTToken) => {
        setIsFetching(false);
        setToken(token);
      }); */
    }
    return {};
  }, [collectionId, tokenId, token, restApi]);

  return (
    <TokensCardStyled>
      <PictureWrapper href={`/token/${collectionId || ''}/${tokenId || ''}`}>
        <Picture alt={tokenId?.toString() || ''} src={imagePath} />
      </PictureWrapper>
      <Description>
        <a
          href={`/token/${collectionId || ''}/${tokenId || ''}`}
          title={`${tokenPrefix || ''} #${tokenId || ''}`}
        >
          <Text size="l">{`${tokenPrefix || ''} #${tokenId || ''}`}</Text>
        </a>
        <a
          href={`${config.scanUrl || ''}collections/${collectionId || ''}`}
          target={'_blank'}
          rel="noreferrer"
        >
          <Text color="primary-600" size="s">
            {`${collectionName?.substring(0, 15) || ''} [id ${collectionId || ''}]`}
          </Text>
        </a>
        {price && <Text size="s">{`Price: ${formatKusamaBalance(price)}`}</Text>}
      </Description>

      {isFetching && <Loading />}
    </TokensCardStyled>
  );
};

const TokensCardStyled = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const PictureWrapper = styled.a`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  .picture {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    color: white;
    text-align: center;
    max-height: 100%;
    border-radius: 8px;
    transition: 50ms;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    svg {
      border-radius: 8px;
    }

    &:hover {
      transform: translate(0, -5px);
      text-decoration: none;
    }
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: var(--color-primary-600);

    &:nth-of-type(2) {
      margin-bottom: 8px;
    }
  }
`;
