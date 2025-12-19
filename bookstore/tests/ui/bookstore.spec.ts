import { test } from '../../../fixtures/bookstoreFixtures';

test('Successfully remove books', async ({ bookstoreAPI, userLogin, pages }) => {
  await userLogin;
  await pages.profilePage.deleteAccount();
});