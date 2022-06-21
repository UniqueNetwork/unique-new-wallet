import { ReactNode } from 'react';

import {
  Accounts,
  Coins,
  CreateCollection,
  CollectionNft,
  CollectionPage,
  Faq,
  MyCollections,
  MyTokens,
  NFTs,
  NotFound,
  Welcome,
  NFTDetails,
  CreateNFT,
} from '@app/pages';
import { CollectionForm } from '@app/context';
import CollectionSettings from '@app/pages/CollectionPage/pages/CollectionSettings';
import { MainInformation, NFTAttributes } from '@app/pages/CreateCollection/pages';

export interface RouteItem {
  children?: RouteItem[];
  component: ReactNode;
  index?: boolean;
  name: string;
  path: string;
}

export interface MenuRoute extends RouteItem {
  notProtected?: boolean;
  children?: MenuRoute[];
}

export interface RouteConfig {
  base: string;
  menuRoutes: MenuRoute[];
  otherRoutes: MenuRoute[];
}

export const routes: RouteConfig = {
  base: '/',
  menuRoutes: [
    {
      name: 'My tokens',
      path: '/my-tokens',
      component: (
        <MyTokens activeTab={0} basePath="/my-tokens" tabUrls={['nft', 'coins']} />
      ),
      children: [
        {
          component: <NFTs />,
          name: 'NFTs',
          path: '/nft',
        },
        {
          component: <Coins />,
          name: 'Coins',
          path: 'coins',
        },
      ],
    },
    {
      component: <MyCollections />,
      name: 'My collections',
      path: '/my-collections',
      children: [
        {
          component: <CollectionPage basePath="/my-collections" />,
          name: 'Collection page',
          path: '/:collectionId',
          children: [
            {
              component: <CollectionNft />,
              name: 'NFTs',
              path: 'nft',
            },
            {
              component: <CollectionSettings />,
              name: 'Settings',
              path: 'settings',
            },
          ],
        },
      ],
    },
    {
      component: <Faq />,
      name: 'FAQ',
      path: '/faq',
      notProtected: true,
    },
  ],
  otherRoutes: [
    {
      component: <Welcome />,
      name: 'Welcome',
      path: '/',
    },
    {
      component: <NotFound />,
      name: 'Accounts',
      path: '*',
    },
    {
      component: <Accounts />,
      name: 'Accounts',
      path: '/accounts',
      notProtected: true,
    },
    {
      component: (
        <CollectionForm>
          <CreateCollection />
        </CollectionForm>
      ),
      name: 'Create collection',
      path: '/create-collection',
      children: [
        {
          component: <MainInformation />,
          name: 'Main information',
          path: 'main-information',
        },
        {
          component: <NFTAttributes />,
          name: 'Nft attributes',
          path: 'nft-attributes',
        },
      ],
    },
    {
      name: 'NFTDetails',
      path: 'nft-details/:collectionId/:tokenId',
      component: <NFTDetails />,
      notProtected: true,
    },
    {
      component: <CreateNFT />,
      name: 'Create a NFT',
      path: '/create-nft',
    },
  ],
};
