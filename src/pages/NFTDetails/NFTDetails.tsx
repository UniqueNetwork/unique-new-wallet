import React, { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Avatar, Heading, SelectOptionProps } from '@unique-nft/ui-kit';

import { PagePaper } from '@app/components';

import { CollectionInformation, Divider, NFTDetailsHeader } from './components';

interface NFTDetailsProps {
  className?: string;
}

const options: SelectOptionProps[] = [
  {
    id: 1,
    title: 'Share',
    icon: {
      name: 'shared',
      size: 12,
    },
  },
  {
    id: 2,
    title: 'Burn NFT',
    color: 'var(--color-coral-500)',
    icon: {
      name: 'burn',
      size: 12,
    },
  },
];

const NFTDetailsComponent: VFC<NFTDetailsProps> = ({ className }) => {
  return (
    <PagePaper className={classNames(className, 'test')}>
      <Avatar
        size={536}
        src="https://ipfs.uniquenetwork.dev/ipfs/QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb"
      />
      <div>
        <NFTDetailsHeader options={options} />
        <Divider />
        <Heading size="4">Attributes</Heading>
        <Divider />
        <CollectionInformation
          title="CryptoDuckies оч классные, позитивные,выглядят звездец прикольно [id 1234567]"
          avatar="https://ipfs.uniquenetwork.dev/ipfs/QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb"
          description="Adopt yourself a Duckie and join The Flock.Each Duck is a 1 of 1 programmatically generated with a completely unique combination of traits. No two are identical. In total there are 5000 Duckies. Stay up to date on drops by joining the Discord and following"
        />
      </div>
    </PagePaper>
  );
};

export const NFTDetails = styled(NFTDetailsComponent)`
  &.test {
    display: flex;
    flex-direction: row;
  }
`;
