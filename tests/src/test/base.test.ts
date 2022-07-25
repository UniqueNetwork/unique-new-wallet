import {test as base, chromium} from '@playwright/test';
import 'dotenv/config';
import path from 'path';


const extensionPath = path.join(__dirname, '../../extensions');

base.beforeAll(async ({playwright}) => {
    await playwright.request.newContext({
        extraHTTPHeaders: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
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

export {baseUiTest};
