import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Pagination, Text, TokenLink } from '@unique-nft/ui-kit';

interface NftListComponentProps {
  className?: string;
  collectionId: string;
}

interface NftItemShort {
  id: string;
  tokenImage: string;
}

// todo fetch from the api
const collectionNFTs: NftItemShort[] = [
  {
    id: '9698',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9697',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9696',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9695',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9694',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9693',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9692',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9691',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9690',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
  {
    id: '9680',
    tokenImage:
      'https://ipfs.unique.network/ipfs/QmZT1XVDVPLYEn7DEyVG9hzd93NRKWD12eRAKuFV9MH7zM',
  },
];

const NftListComponent: VFC<NftListComponentProps> = ({ className, collectionId }) => {
  // todo - fetch from api
  const collectionName = 'Chelobrik';
  const tokenPrefix = 'Chel';

  const onPageChange = (page: number) => {
    console.log('page', page);
  };

  return (
    <div className={classNames('nft-list', className)}>
      <div className="nft-list--body">
        {collectionNFTs.map((nft) => (
          <TokenLink
            image={nft.tokenImage}
            key={nft.id}
            link={{
              href: `/my-tokens/${nft.id}`,
              title: `${collectionName}] [${collectionId}]`,
            }}
            title={`${tokenPrefix}] #${nft.id}`}
          />
        ))}
      </div>
      <div className="nft-list--footer">
        <Text size="m">{`${collectionNFTs.length} items`}</Text>
        <Pagination withIcons size={100} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export const NftList = styled(NftListComponent)`
  .nft-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: calc(var(--gap) * 2);
    grid-row-gap: calc(var(--gap) * 2);

    &--body {
      padding: calc(var(--gap) * 2);
      display: grid;
      grid-template-columns: repeat(5, 1fr);

      .unique-token-link {
        width: 268px;

        img {
          height: 268px;
          width: 268px;
        }
      }
    }

    &--footer {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 0 calc(var(--gap) * 2) calc(var(--gap) * 2) calc(var(--gap) * 2);
    }
  }
`;
