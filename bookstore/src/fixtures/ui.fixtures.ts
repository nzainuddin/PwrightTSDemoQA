import { test as base } from '@playwright/test';
import { test as apiTest } from './api.fixtures'
import { LoginPage as LoginPage } from '../ui/pages/login.page';
import { ProfilePage } from '../ui/pages/profile.page';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

type CustomFixtures = {
  credentials: { baseURL: string; user: string; pwd: string };
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

  apiAccount: async ({ apiAccount: apiAccountFixture }, use) => {
    await use(apiAccountFixture);
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