export const enum ROUTE {
  BASE = '/',
  MY_TOKENS = 'my-tokens',
  MY_COLLECTIONS = 'my-collections',
  CREATE_COLLECTION = 'create-collection',
  CREATE_NFT = 'create-nft',
  TOKEN = 'token/:collectionId/:tokenId',
  FAQ = 'faq',
  ACCOUNTS = 'accounts',
  NOT_FOUND = '*',
}

export const enum MY_TOKENS_TABS_ROUTE {
  NFT = 'nft',
  COINS = 'coins',
}

export const enum MY_COLLECTIONS_ROUTE {
  COLLECTION = ':collectionId',
  NFT = 'nft',
}

export const NETWORK_ROUTE = ':network/';

export const enum COLLECTION_TABS_ROUTE {
  NFT = 'nft',
  SETTINGS = 'settings',
}

export const enum CREATE_COLLECTION_TABS_ROUTE {
  MAIN_INFORMATION = 'main-information',
  NFT_ATTRIBUTES = 'nft-attributes',
}
