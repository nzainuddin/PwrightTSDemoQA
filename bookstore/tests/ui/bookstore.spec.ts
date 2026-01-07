import { test } from '../../src/fixtures/index';

test('Successfully remove books', async ({ userLogin, pages }) => {
  userLogin;
  await pages.profilePage.deleteAccount();
});