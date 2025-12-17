import { test } from '../../../fixtures/fixtures';

test('Successfully remove books', async ({ bookstoreAPI, userLogin, pages }) => {
  await userLogin;
  await pages.profilePage.deleteAccount();
});