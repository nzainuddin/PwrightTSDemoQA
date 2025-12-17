import { test as base } from '@playwright/test';
import { BookStoreAPI } from '../bookstore/src/api/BookStoreAPI';
import { LoginPage as LoginPage } from '../bookstore/src/ui/pages/LoginPage';
import { ProfilePage } from '../bookstore/src/ui/pages/ProfilePage';

type CustomFixtures = {
  bookstoreAPI: BookStoreAPI;
  apiAccount: { username: string; token: string };

  userLogin: ProfilePage;
  pages: {
    loginPage: LoginPage;
    profilePage: ProfilePage;
  };
};

const user = process.env.BOOKSTORE_USERNAME!;
const pwd = process.env.BOOKSTORE_PASSWORD!

export const test = base.extend<CustomFixtures>({
  apiAccount: async ({ request }, use) => {
    const api = new BookStoreAPI(request, user, pwd);

    await api.registerUser();

    const token = await api.generateToken();
    await use({ username: user, token})
  },

  bookstoreAPI: async ({ request }, use) => {
    await use(new BookStoreAPI(request, user, pwd));
  },

  pages: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      profilePage: new ProfilePage(page),
    })
  },

  userLogin: async ({ pages, apiAccount }, use) => {
    await pages.loginPage.login(user, pwd);
    await use(pages.profilePage)
  }
});