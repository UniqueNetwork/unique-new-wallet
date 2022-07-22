import 'dotenv/config';
import {PlaywrightTestConfig} from "@playwright/test";


const config: PlaywrightTestConfig = {
    timeout: 600000,
    use: {
        viewport: { width: 1280, height: 720 },
        baseURL: 'http://localhost:3000/',
        channel: 'chromium',
        video: 'off',
        actionTimeout: 120000
    }
};

export default config;
