import { test as base, chromium } from '@playwright/test';
import 'dotenv/config';
import path from 'path';
import { initApiContext } from '../api/base-api';


const extensionPath = path.join(__dirname, '../../extensions');

base.beforeAll(async ({ playwright }) => {
    await initApiContext(playwright);
});

const baseUiTest = base.extend({
    context: async ({}, use) => {
        const launchOptions = {
            devtools: false,
            headless: false,
            args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
        };
        const context = await chromium.launchPersistentContext('', launchOptions);
        await use(context);
    }
});

export { baseUiTest };
