const collectionParam = { name: 'collection', type: 'UpDataStructsCollectionId' };

type RpcParam = {
  name: string;
  type: string;
  isOptional?: true;
};

const atParam = { isOptional: true, name: 'at', type: 'Hash' };

const fun = (description: string, params: RpcParam[], type: string) => ({
  description,
  params: [...params, atParam],
  type,
});

const CROSS_ACCOUNT_ID_TYPE = 'PalletCommonAccountBasicCrossAccountIdRepr';
const TOKEN_ID_TYPE = 'UpDataStructsTokenId';

const crossAccountParam = (name = 'account') => ({ name, type: CROSS_ACCOUNT_ID_TYPE });
const tokenParam = { name: 'tokenId', type: TOKEN_ID_TYPE };

const rpcMethods = {
  accountBalance: fun(
    'Get amount of different user tokens',
    [collectionParam, crossAccountParam()],
    'u32',
  ),
  accountTokens: fun(
    'Get tokens owned by account',
    [collectionParam, crossAccountParam()],
    'Vec<UpDataStructsTokenId>',
  ),
  adminlist: fun(
    'Get admin list',
    [collectionParam],
    'Vec<PalletCommonAccountBasicCrossAccountIdRepr>',
  ),
  allowance: fun(
    'Get allowed amount',
    [
      collectionParam,
      crossAccountParam('sender'),
      crossAccountParam('spender'),
      tokenParam,
    ],
    'u128',
  ),
  allowed: fun(
    'Check if user is allowed to use collection',
    [collectionParam, crossAccountParam()],
    'bool',
  ),
  allowlist: fun(
    'Get allowlist',
    [collectionParam],
    'Vec<PalletCommonAccountBasicCrossAccountIdRepr>',
  ),
  balance: fun(
    'Get amount of specific account token',
    [collectionParam, crossAccountParam(), tokenParam],
    'u128',
  ),
  collectionById: fun(
    'Get collection by specified id',
    [collectionParam],
    'Option<UpDataStructsCollection>',
  ),
  collectionStats: fun('Get collection stats', [], 'UpDataStructsCollectionStats'),
  collectionTokens: fun(
    'Get tokens contained in collection',
    [collectionParam],
    'Vec<UpDataStructsTokenId>',
  ),
  constMetadata: fun(
    'Get token constant metadata',
    [collectionParam, tokenParam],
    'Vec<u8>',
  ),
  lastTokenId: fun('Get last token id', [collectionParam], TOKEN_ID_TYPE),
  tokenExists: fun('Check if token exists', [collectionParam, tokenParam], 'bool'),
  tokenOwner: fun(
    'Get token owner',
    [collectionParam, tokenParam],
    CROSS_ACCOUNT_ID_TYPE,
  ),
  variableMetadata: fun(
    'Get token variable metadata',
    [collectionParam, tokenParam],
    'Vec<u8>',
  ),
};

export default rpcMethods;
