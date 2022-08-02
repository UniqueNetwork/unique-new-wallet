import { Locator, Page } from '@playwright/test';

import { BasePage } from './base-page';

export class MyTokensPage extends BasePage {
  readonly statusFilter: Locator;
  readonly tokensList: Locator;
  readonly sortSelector: Locator;

  constructor(page: Page) {
    super(page);
    this.statusFilter = page.locator(
      '//div[contains(@class, "NFTPage__LeftColum")]//div[contains(@class, "StatusFilter__StatusFilterWrapper")]',
    );
    this.tokensList = page.locator('//div[contains(@class, "picture")]/../../..');
    this.sortSelector = page.locator('.select-value');
  }

  async navigate() {
    await this.page.goto('/my-tokens');
  }
}
