import { test as base } from '@playwright/test';
import { RegistrationPage } from '../student/src/pages/RegistrationPage';
import { LoginPage as BookStoreLoginPage } from '../bookstore/src/ui/pages/LoginPage';

type CustomFixtures = {
  registrationPage: RegistrationPage;
  bookstoreLoginPage: BookStoreLoginPage;
};

export const test = base.extend<CustomFixtures>({
  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },

  bookstoreLoginPage: async ({ page, request }, use) => {
    const loginBookStorePage = new BookStoreLoginPage(page);
    const registerUser = await request.post('/Account/v1/User', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { userName: "Harry", password: "Harrington005$" }
    });
    const { userID } = await registerUser.json();


    const getBooksResponse = await request.get('/BookStore/v1/Books');
    const booksResult = await getBooksResponse.json();
    const bookISBN = booksResult.books
        .find((book: { title: string }) => book.title === 'Git Pocket Guide')?.isbn || null;


    const addBooksToUser = await request.post('/BookStore/v1/Books', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        userId: userID,
        collectionOfIsbns: [{ isbn: bookISBN }]
      }
    });

  
    await use(loginBookStorePage);
  }
});