import { baseUiTest } from './base.test';
import { MyTokensPage } from '../pom';
import { PolkadotjsExtensionPage } from '../pom/polkadotjs-extension-page';
import {MyCollectionsPage} from "../pom/my-collections-page";
import {generateAccount} from "../utils/api";
import {expect} from "@playwright/test";


baseUiTest.describe('Tests', () => {
    baseUiTest.beforeEach(async ({ context }) => {
        const myTokensPage = new MyTokensPage(await context.newPage());
        await myTokensPage.navigate();
        const polkdotExtensionPage = new PolkadotjsExtensionPage(await context.newPage());
        await polkdotExtensionPage.firstOpen();
        await polkdotExtensionPage.close();
        await myTokensPage.close();
    });

    baseUiTest('Create collection', async ({ page, context }) => {
        const testUser = await generateAccount(100);

        await PolkadotjsExtensionPage.connectAccountByExtension(await context.newPage(), testUser.mnemonic, '1234qwe',
            'TestUser', testUser.keyfile.address);

        const myCollectionsPage = new MyCollectionsPage(await context.newPage());
        await myCollectionsPage.navigate();
        await myCollectionsPage.waitAccountConnected('TestUser');

        await myCollectionsPage.createCollection('testCol', 'TST', 'TST', '1234qwe', context);
        await expect(myCollectionsPage.collectionLink).toHaveCount(1);
    });
});




