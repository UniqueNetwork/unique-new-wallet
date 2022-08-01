import {Page, Locator, expect} from '@playwright/test';

export abstract class BasePage {
    readonly page: Page;
    readonly accountName: Locator;
    readonly successNotification: Locator;

    protected constructor(page: Page) {
        this.page = page;
        this.accountName = page.locator('.accounts-manager-selected-account-name > span');
        this.successNotification = page.locator('//*[@data-testid="icon-success"]/..');
    }

    async reload() {
        await this.page.reload();
    }

    async close() {
        await this.page.close();
    }

    /**
     * Waiting for account to load in right corner
     * @param expectedAccountName
     * @param timeout
     */
    async waitAccountConnected(expectedAccountName: string, timeout = 3000000) {
        await expect(this.accountName, `Account ${expectedAccountName} has not been connected`)
            .toHaveText(expectedAccountName, {timeout});
    }
}
