import { APIRequestContext } from 'playwright-core';

const API_URL = process.env.MARKET_API_URL;
export const BASE_API_PREFIX = '/api';

export let apiContext: APIRequestContext;

export const initApiContext = async (playwright: typeof import('playwright-core')) => {
    apiContext = await playwright.request.newContext({
        baseURL: API_URL,
        extraHTTPHeaders: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
};
