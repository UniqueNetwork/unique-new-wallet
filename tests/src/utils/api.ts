import axios from "axios";
import {Keyring} from "@polkadot/keyring";
import {cryptoWaitReady} from "@polkadot/util-crypto";

export async function generateAccount(balance: number = 0) {
    const testUser = await getRequest(`account/generate`,
        'POST',
        {
            "pairType": "sr25519",
            "meta": {}
        });

    if (!!balance) {
        const keyring = new Keyring({type: 'sr25519'});
        await cryptoWaitReady();
        const accountFrom = keyring.addFromUri('//Eve');

        await transferBalance(`${accountFrom.address}`, `${testUser.keyfile.address}`, balance, '//Eve')
    }

    return testUser;
}

export async function transferBalance(addressFrom: string, addressTo: string, amount: number, seed: string) {
    const payload = await getRequest(`balance/transfer`,
        'POST',
        {
            "address": addressFrom,
            "destination": addressTo,
            "amount": amount
        });

    const signResult = await signExtrinsic(payload, seed);
    const hash = await submitExtrinsic(payload.signerPayloadJSON, signResult.signature);
    await waitCompletedStatusExtrinsic(hash.hash, 30);
}


export async function createCollection(collectionParam: { address: string, nameCol: string, tokenPrefix: string, description: string }, seed: string) {
    const payload = await getRequest(`collection`,
        'POST',
        {
            "address": collectionParam.address,
            "description": collectionParam.description,
            "limits": {
                "ownerCanDestroy": true,
                "ownerCanTransfer": false,
                "tokenLimit": null
            },
            "metaUpdatePermission": "ItemOwner",
            "mode": "Nft",
            "name": collectionParam.nameCol,
            "properties": {
                "offchainSchema": "",
                "schemaVersion": "Unique",
                "variableOnChainSchema": "{}",
                "constOnChainSchema": {
                    "nested": {
                        "onChainMetaData": {
                            "nested": {
                                "NFTMeta": {
                                    "fields": {
                                        "ipfsJson": {
                                            "id": 1,
                                            "rule": "required",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "tokenPrefix": collectionParam.tokenPrefix,
            "permissions": {
                "access": "Normal",
                "mintMode": true,
                "nesting": "Disabled"
            },
            "tokenPropertyPermissions": {
                "constData": {
                    "mutable": true,
                    "collectionAdmin": true,
                    "tokenOwner": true
                }
            }
        });

    const signResult = await signExtrinsic(payload, seed);
    const hash = await submitExtrinsic(payload.signerPayloadJSON, signResult.signature);
    await waitCompletedStatusExtrinsic(hash.hash, 30);
}

// TODO add upload file
export async function createToken(tokenParam: { address: string, collectionId: number }, seed: string) {
    const payload = await getRequest('token',
        'POST',
        {
            "address": tokenParam.address,
            "collectionId": tokenParam.collectionId,
            "owner": tokenParam.address,
            "constData": {
                "ipfsJson": "{\"ipfs\":\"QmVrF9EJJJYeUVkqrtELe5dujMQ9KWyaMeWxp8Qj3zQLyV\",\"type\":\"image\"}",
                "gender": "Male",
                "traits": [
                    "TEETH_SMILE",
                    "UP_HAIR"
                ]
            }
        });

    const signResult = await signExtrinsic(payload, seed);
    const hash = await submitExtrinsic(payload.signerPayloadJSON, signResult.signature);
    await waitCompletedStatusExtrinsic(hash.hash, 30);
}


export async function transferToken(params: { collectionId: number, tokenId: number, from: string, to: string }) {
    return await getRequest('token/transfer',
        'PATCH',
        params
    );
}

export async function transferCollection(params: { collectionId: number, from: string, to: string }) {
    return await getRequest('collection/transfer',
        'PATCH',
        params
    );
}

async function signExtrinsic(payload: any, seed: string) {
    return await getRequest(`extrinsic/sign`,
        'POST',
        payload,
        {
            'Authorization': `Seed ${seed}`,
            'Content-Type': 'application/json'
        });
}

async function submitExtrinsic(signerPayloadJSON: any, signature: any) {
    return await getRequest(`extrinsic/submit`,
        'POST',
        {
            "signerPayloadJSON": signerPayloadJSON,
            "signature": signature
        });
}

async function getRequest(urlParam: string,
                          methodParam: any = 'GET',
                          bodyParam: any = {},
                          headersParam: any = {
                              'Content-Type': 'application/json'
                          }) {
    const response = await axios({
        url: `${process.env.NET_QUARTZ_API}${urlParam}`,
        method: methodParam,
        headers: headersParam,
        data: bodyParam
    });
    return response.data;
}


async function waitCompletedStatusExtrinsic(hash: any, n: number) {
    let response = await getRequest(`extrinsic/status?hash=${hash}`);
    if (response.isCompleted == true) return;
    if (n <= 1) throw new Error('Transfer balance error');
    await sleep(1000);
    await waitCompletedStatusExtrinsic(hash, n - 1);
}


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
