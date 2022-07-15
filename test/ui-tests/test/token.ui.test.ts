import { baseUiTest } from './base.test';
import { MyTokensPage } from '../pom';
import { PolkadotjsExtensionPage } from '../pom/polkadotjs-extension-page';
import axios from "axios";
import {MyCollectionsPage} from "../pom/my-collections-page";

baseUiTest.describe('Tests (@ui)', () => {
    baseUiTest.beforeEach(async ({ context }) => {
        const myTokensPage = new MyTokensPage(await context.newPage());
        await myTokensPage.navigate();
        const polkdotExtensionPage = new PolkadotjsExtensionPage(await context.newPage());
        await polkdotExtensionPage.firstOpen();
        await polkdotExtensionPage.close();
        await myTokensPage.close();
    });

    baseUiTest('Create collection', async ({ page, context }) => {
        let response = await axios({
            url: `${process.env.REACT_APP_NET_QUARTZ_API}account/generate`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: {
                "password": "qwe1234",
                "pairType": "sr25519",
                "meta": {},
            },
        });
        const testUser = response.data;


        const payload = await axios({
            url: `${process.env.REACT_APP_NET_QUARTZ_API}balance/transfer`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "address": "",
                "destination": `${testUser.keyfile.address}`,
                "amount": 100
            },
        });

        const signResult = await axios({
            url: `${process.env.REACT_APP_NET_QUARTZ_API}extrinsic/sign`,
            method: 'POST',
            headers: {
                'Authorization': `Seed //Bob`,
                'Content-Type': 'application/json'
            },
            data: payload.data
        });

        await axios({
            url: `${process.env.REACT_APP_NET_QUARTZ_API}extrinsic/submit`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: {
                "signerPayloadJSON": payload.data.signerPayloadJSON,
                "signature": signResult.data.signature
            }
        });


        await PolkadotjsExtensionPage.connectAccountByExtension(await context.newPage(), testUser.mnemonic, '1234qwe',
            'TestUser', testUser.keyfile.address);

        const myCollectionsPage = new MyCollectionsPage(await context.newPage());
        await myCollectionsPage.navigate();
        await myCollectionsPage.waitAccountConnected('TestUser');

        await myCollectionsPage.createCollection('testCol', 'TST', 'TST', '1234qwe', context);
    });
});
