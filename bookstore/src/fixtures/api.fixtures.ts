import { test as base } from '@playwright/test';
import { ControllerAPI } from '../api/controller.api';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

type CustomFixtures = {
    credentials: { baseURL: string; user: string; pwd: string };
    controllerAPI: ControllerAPI;
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

    controllerAPI: async ({ request, credentials}, use) => {
        await use(new ControllerAPI(request, credentials.baseURL, credentials.user, credentials.pwd));
    },

    apiAccount: async ({ controllerAPI, credentials }, use) => {
        await controllerAPI.registerUser();

        const token = await controllerAPI.generateToken();
        await use({ username: credentials.user, token})
    }
});
