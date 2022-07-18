import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import {PolkadotjsExtensionPage} from "./polkadotjs-extension-page";
import { expect } from '@playwright/test';


export class MyCollectionsPage extends BasePage {
    readonly createCollectionButton: Locator;
    readonly nameInputSelector: Locator;
    readonly descriptionInputSelector: Locator;
    readonly symbolInputSelector: Locator;
    readonly nextStepButton: Locator;
    readonly yesModalButton: Locator;
    readonly createACollectionButton: Locator;
    readonly collectionLink: Locator;

    constructor(page: Page) {
        super(page);
        this.createCollectionButton = page.locator('//button[text()="Create collection"]');
        this.nameInputSelector = page.locator('input[name="name"]');
        this.descriptionInputSelector = page.locator('input[name="description"]');
        this.symbolInputSelector = page.locator('input[name="symbol"]');
        this.nextStepButton = page.locator('//button[text()="Next step"]');
        this.yesModalButton = page.locator('//button[text()="Yes, I am sure"]');
        this.createACollectionButton = page.locator('//button[text()="Create a collection"]');
        this.collectionLink = page.locator('.my-collections-list a.unique-collection-link')
    }

    async navigate() {
        await this.page.goto('/my-collections');
    }


    /**
     * create collection
     * @param nameCol
     * @param symbolCol
     * @param description
     * @param password
     * @param context
     */
    async createCollection(nameCol: string, symbolCol: string, description: string = '', password: string, context: any) {
        // step1
        await this.createCollectionButton.click();
        await this.nameInputSelector.fill(nameCol);
        await this.symbolInputSelector.fill(symbolCol);
        // await this.descriptionInputSelector.fill(description);
        await this.nextStepButton.click();
        await this.yesModalButton.click();

        // step2
        await this.createACollectionButton.click();
        await this.yesModalButton.click();

        const polkdotExtensionPage = new PolkadotjsExtensionPage(await context.newPage());

        await polkdotExtensionPage.navigate();
        await polkdotExtensionPage.fillPassword(password);
        await polkdotExtensionPage.close();

        // check notification
        await this.successNotification.waitFor({state: "visible"});
        await expect(this.successNotification).toHaveText('Collection created successfully');
    }

}