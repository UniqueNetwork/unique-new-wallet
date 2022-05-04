import { ReactNode } from 'react';

import {
  Accounts,
  Coins,
  CreateCollection,
  Faq,
  MainInformation,
  MyCollections,
  MyTokens,
  NFTs,
  NotFound,
  Welcome,
} from '@app/pages';
import { CollectionForm } from '@app/context';

export interface RouteItem {
  children?: RouteItem[];
  component: ReactNode;
  index?: boolean;
  name: string;
  path: string;
}

export interface MenuRoute extends RouteItem {
  children?: MenuRoute[];
}

export interface RouteConfig {
  base: string;
  menuRoutes: MenuRoute[];
  otherRoutes: RouteItem[];
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
          path: 'nft',
          children: [
            {
              component: <div>NftId</div>,
              name: '',
              path: ':collectionId/:nftId',
            },
            {
              component: <div>Create a NFT</div>,
              name: 'Create a NFT',
              path: 'create-nft',
            },
          ],
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
          component: <div>Collection id</div>,
          name: '',
          path: ':collectionId',
          children: [
            {
              component: <div>NFTs</div>,
              name: 'NFTs',
              path: 'nft',
            },
            {
              component: <div>Settings</div>,
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
          component: <div>Nft attributes</div>,
          name: 'Nft attributes',
          path: 'nft-attributes',
        },
      ],
    },
  ],
};
