import { test } from '../../../fixtures/fixtures';

test('Successfully remove books', async ({ bookstoreLoginPage, bookstorePages }) => {
  bookstoreLoginPage;
  await bookstorePages.profilePage.deleteAccount();
});