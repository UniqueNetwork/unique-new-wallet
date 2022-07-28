import { RouteObject } from 'react-router-dom';

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
import { TokenForm } from '@app/context';
import CollectionSettings from '@app/pages/CollectionPage/pages/CollectionSettings';
import { MainInformation, NFTAttributes } from '@app/pages/CreateCollection/tabs';

import {
  COLLECTION_TABS_ROUTE,
  CREATE_COLLECTION_TABS_ROUTE,
  MY_COLLECTIONS_ROUTE,
  MY_TOKENS_TABS_ROUTE,
  ROUTE,
} from './routes';

export type RouteItem = Omit<RouteObject, 'children'> & {
  name: string;
  children?: RouteItem[];
};

export interface RouteConfig {
  base: string;

  protectedRoutes: RouteItem[];
  sharedRoutes: RouteItem[];
}

export const routes: RouteConfig = {
  base: ROUTE.BASE,
  protectedRoutes: [
    {
      index: true,
      element: <Welcome />,
      name: 'Welcome',
    },
    {
      name: 'My tokens',
      path: ROUTE.MY_TOKENS,
      element: (
        <MyTokens activeTab={0} basePath={ROUTE.MY_TOKENS} tabUrls={['nft', 'coins']} />
      ),
      children: [
        {
          element: <NFTs />,
          name: 'NFTs',
          path: MY_TOKENS_TABS_ROUTE.NFT,
        },
        {
          element: <Coins />,
          name: 'Coins',
          path: MY_TOKENS_TABS_ROUTE.COINS,
        },
      ],
    },
    {
      element: <MyCollections />,
      name: 'My collections',
      path: ROUTE.MY_COLLECTIONS,
      children: [
        {
          element: <CollectionPage basePath={ROUTE.MY_COLLECTIONS} />,
          name: 'Collection page',
          path: MY_COLLECTIONS_ROUTE.COLLECTION,
          children: [
            {
              element: <CollectionNft />,
              name: 'NFTs',
              path: COLLECTION_TABS_ROUTE.NFT,
            },
            {
              element: <CollectionSettings />,
              name: 'Settings',
              path: COLLECTION_TABS_ROUTE.SETTINGS,
            },
          ],
        },
      ],
    },
    {
      element: <CreateCollection />,
      name: 'Create collection',
      path: ROUTE.CREATE_COLLECTION,
      children: [
        {
          element: <MainInformation />,
          name: 'Main information',
          path: CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION,
        },
        {
          element: <NFTAttributes />,
          name: 'Nft attributes',
          path: CREATE_COLLECTION_TABS_ROUTE.NFT_ATTRIBUTES,
        },
      ],
    },
    {
      element: (
        <TokenForm>
          <CreateNFT />
        </TokenForm>
      ),
      name: 'Create a NFT',
      path: ROUTE.CREATE_NFT,
    },
  ],
  sharedRoutes: [
    {
      name: 'NFTDetails',
      path: ROUTE.TOKEN,
      element: <NFTDetails />,
    },
    {
      element: <Faq />,
      name: 'FAQ',
      path: ROUTE.FAQ,
    },
    {
      element: <Accounts />,
      name: 'Accounts',
      path: ROUTE.ACCOUNTS,
    },
    {
      element: <NotFound />,
      name: 'Not found',
      path: ROUTE.NOT_FOUND,
    },
  ],
};
