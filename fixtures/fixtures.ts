import { test as base } from '@playwright/test';
import { RegistrationPage } from '../student/src/pages/RegistrationPage';
import { BookStoreAPI } from '../bookstore/src/api/BookStoreAPI';
import { LoginPage as BookStoreLoginPage, LoginPage } from '../bookstore/src/ui/pages/LoginPage';
import { ProfilePage } from '../bookstore/src/ui/pages/ProfilePage';

type CustomFixtures = {
  bookstoreAPI: BookStoreAPI;
  apiAccount: { username: string; token: string };

  userLogin: ProfilePage;
  pages: {
    loginPage: LoginPage;
    profilePage: ProfilePage;
  };
  // addBooksCollections: BookStoreAPI;
  // registrationPage: RegistrationPage;
  // bookstoreLogin: BookStoreLoginPage;
  // bookstorePages: {
  //   loginPage: BookStoreLoginPage;
  //   profilePage: ProfilePage;
  // };
  // bookTitles: string[];
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

  // registrationPage: async ({ page }, use) => {
  //   const registrationPage = new RegistrationPage(page);
  //   await use(registrationPage);
    
  // },

  // bookstoreAPI: async ({ request }, use) => {
  //   const { BOOKSTORE_USERNAME: username, BOOKSTORE_PASSWORD: pwd } = process.env;
  //   if (!username || !pwd) throw new Error('❌ Missing BOOKSTORE_USER or BOOKSTORE_PASS in .env');
    
  //   const api = new BookStoreAPI(request, username, pwd);
  //   await api.registerUser;
  //   await use(new BookStoreAPI(request, username, pwd));
  // },

  // bookstorePages: async ({ page }, use) => {
  //   const loginPage = new BookStoreLoginPage(page);
  //   const profilePage = new ProfilePage(page);
  //   await use({ loginPage, profilePage });
  // },

  // bookstoreLogin: async ({ page }, use) => {
  //   const loginPage = new BookStoreLoginPage(page);    
  //   await loginPage.login(process.env.BOOKSTORE_USERNAME!, process.env.BOOKSTORE_PASSWORD!);
  //   await use(loginPage);
  //   console.log('Successfully login')
  // }
});