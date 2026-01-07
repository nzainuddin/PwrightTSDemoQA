import { test } from '../../src/fixtures/index';

test('Successfully delete account', async ({ userLogin, pages }) => {
  userLogin;
  await pages.profilePage.deleteAccount();
});