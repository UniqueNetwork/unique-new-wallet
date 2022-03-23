import RpcClient from './chainApi/rpcClient';
import { GqlClient } from './graphQL/gqlClient';

// TODO remove gqlClient
export const gqlClient = new GqlClient('');

export const rpcClient = new RpcClient();
