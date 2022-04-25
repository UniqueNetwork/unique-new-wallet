import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Accounts, CreateCollection, Faq, MainInformation, NotFound } from '@app/pages';
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
        <div>
          My tokens
          <Outlet />
        </div>
      ),
      children: [
        {
          component: <div>Nfts</div>,
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
            }
          ]
        },
        {
          component: <div>Coins</div>,
          name: 'Coins',
          path: 'coins',
        }
      ]
    },
    {
      component: <div>My collections</div>,
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
          ]
        },
      ]
    },
    {
      component: <Faq />,
      name: 'FAQ',
      path: '/faq',
    },
  ],
  otherRoutes: [
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
      ]
    }
  ]
};
