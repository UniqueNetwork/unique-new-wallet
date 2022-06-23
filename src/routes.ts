export enum ROUTE {
  BASE = '/',
  MY_TOKENS = '/my-tokens',
  MY_COLLECTIONS = '/my-collections',
  CREATE_COLLECTION = '/create-collection',
  CREATE_NFT = '/create-nft',
  TOKEN = 'token/:collectionId/:tokenId',
  FAQ = '/faq',
  ACCOUNTS = '/accounts',
  NOT_FOUND = '*',
}

export enum MY_TOKENS_TABS_ROUTE {
  NFT = 'nft',
  COINS = 'coins',
}

export enum MY_COLLECTIONS_ROUTE {
  COLLECTION = ':collectionId',
}

export enum COLLECTION_TABS_ROUTE {
  NFT = 'nft',
  SETTINGS = 'settings',
}

export enum CREATE_COLLECTION_TABS_ROUTE {
  MAIN_INFORMATION = 'main-information',
  NFT_ATTRIBUTES = 'nft-attributes',
}
