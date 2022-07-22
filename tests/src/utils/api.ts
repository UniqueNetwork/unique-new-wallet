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

        const payload = await getRequest(`balance/transfer`,
            'POST',
            {
                "address": `${accountFrom.address}`,
                "destination": `${testUser.keyfile.address}`,
                "amount": balance
            });

        const signResult = await getRequest(`extrinsic/sign`,
            'POST',
            payload,
            {
                'Authorization': `Seed //Eve`,
                'Content-Type': 'application/json'
            });

        const hash = await getRequest(`extrinsic/submit`,
            'POST',
            {
                "signerPayloadJSON": payload.signerPayloadJSON,
                "signature": signResult.signature
            });

        await waitCompletedStatusTransferBalance(hash.hash, 30);
    }

    return testUser;
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


async function waitCompletedStatusTransferBalance(hash: any, n: number) {
    let response = await getRequest(`extrinsic/status?hash=${hash}`);
    if (response.isCompleted == true) return;
    if (n <= 1) throw new Error('Transfer balance error');
    await sleep(1000);
    await waitCompletedStatusTransferBalance(hash, n - 1);
}


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
