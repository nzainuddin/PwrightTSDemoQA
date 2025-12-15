import { test as base } from '@playwright/test';
import { RegistrationPage } from '../student/src/pages/RegistrationPage';
import { BookStoreAPI } from '../bookstore/src/api/BookStoreAPI';
import { LoginPage as BookStoreLoginPage } from '../bookstore/src/ui/pages/LoginPage';
import { ProfilePage } from '../bookstore/src/ui/pages/ProfilePage';

type CustomFixtures = {
  bookstoreAPI: BookStoreAPI;
  registrationPage: RegistrationPage;
  bookstoreLoginPage: BookStoreLoginPage;
  bookstorePages: {
    loginPage: BookStoreLoginPage;
    profilePage: ProfilePage;
  };
};

export const test = base.extend<CustomFixtures>({
  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },

  bookstoreAPI: async ({ request }, use) => {
      const bookstoreAPI = new BookStoreAPI(request);
      await use(bookstoreAPI);
  },

  bookstorePages: async ({ page }, use) => {
    const loginPage = new BookStoreLoginPage(page);
    const profilePage = new ProfilePage(page);
    await use({ loginPage, profilePage });
  },

  bookstoreLoginPage: async ({ page, bookstoreAPI }, use) => {
    const loginBookStorePage = new BookStoreLoginPage(page);
    const username = 'HARRY', password = 'Harrington@12345';
    
    const userID = await bookstoreAPI.registerUser(username, password);
    const token = await bookstoreAPI.generateToken(username, password);
    const isbn = await bookstoreAPI.getBookISBN('Git Pocket Guide') ?? '';
    // Add books
    if (isbn) await bookstoreAPI.addBookToUser(username, password, userID, token, isbn);
    await loginBookStorePage.login(username, password);
    await use(loginBookStorePage);
  }
});