import { test as base } from '@playwright/test';
import { BaseAPI } from '../api/base.api';
import { ControllerAPI } from '../api/controller.api';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

type CustomFixtures = {
    credentials: { baseURL: string; user: string; pwd: string };
    baseAPI: BaseAPI;
    controllerApi: ControllerAPI;
    apiAccount: { username: string; token: string };
};

export const test = base.extend<CustomFixtures>({
    credentials: async ({}, use) => {
        await use({
        baseURL: process.env.BOOKSTORE_BASE_URL!,
        user: process.env.BOOKSTORE_USERNAME!,
        pwd: process.env.BOOKSTORE_PASSWORD!,
        });
    },

    baseAPI: async ({ request, credentials}, use) => {
        await use(new BaseAPI(request, credentials.baseURL, credentials.user, credentials.pwd));
    },

    apiAccount: async ({ baseAPI, credentials }, use) => {
        await baseAPI.registerUser();

        const token = await baseAPI.generateToken();
        await use({ username: credentials.user, token})
    }
});
