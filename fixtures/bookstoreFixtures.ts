import { test as base } from '@playwright/test';
import { BaseAPI } from '../bookstore/src/api/base.api';
import { LoginPage as LoginPage } from '../bookstore/src/ui/pages/LoginPage';
import { ProfilePage } from '../bookstore/src/ui/pages/ProfilePage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

type CustomFixtures = {
  credentials: { baseURL: string; user: string; pwd: string };
  baseAPI: BaseAPI;
  apiAccount: { username: string; token: string };

  userLogin: ProfilePage;
  pages: {
    loginPage: LoginPage;
    profilePage: ProfilePage;
  };
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
  },

  pages: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      profilePage: new ProfilePage(page),
    })
  },

  userLogin: async ({ pages, apiAccount, credentials }, use) => {
    await pages.loginPage.login(credentials.user, credentials.pwd);
    await use(pages.profilePage)
  }
});