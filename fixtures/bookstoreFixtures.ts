import { test as base } from '@playwright/test';
import { BookStoreAPI } from '../bookstore/src/api/BookStoreAPI';
import { LoginPage as LoginPage } from '../bookstore/src/ui/pages/LoginPage';
import { ProfilePage } from '../bookstore/src/ui/pages/ProfilePage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

type CustomFixtures = {
  credentials: { baseURL: string; user: string; pwd: string };
  bookstoreAPI: BookStoreAPI;
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

  bookstoreAPI: async ({ request, credentials}, use) => {
    console.log(credentials.baseURL);
    await use(new BookStoreAPI(request, credentials.baseURL, credentials.user, credentials.pwd));
  },

  apiAccount: async ({ bookstoreAPI, credentials }, use) => {
    await bookstoreAPI.registerUser();

    const token = await bookstoreAPI.generateToken();
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