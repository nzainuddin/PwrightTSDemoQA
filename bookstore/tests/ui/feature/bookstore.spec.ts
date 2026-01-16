import { test } from '../../../src/fixtures/index';

test('Verify successfully register and log into account', async ({ userLogin, pages }) => {
  // verify able to login
  // verify empty collections of books
});

test('Verify successfully search for books', async ({ userLogin, pages }) => {
  // verify on searching partial title
  // verify on searching full title
});

test('Verify successfully navigate through list of book pages', async ({ userLogin, pages }) => {
  // verify able to navigate to the next page
  // verify able to navigate to the pevious page
});

test('Verify able to delete all books', async ({ userLogin, pages }) => {
  // navigate to profile page
  // verify if there are books listed
  // book available? delete all : add sample books and delete
});

test('Verify successfully adding multiple books', async ({ userLogin, pages, controllerAPI }) => {
  const bookTitles = ['Git Pocket Guide','Understanding ECMAScript 6', 'Speaking JavaScript'];
  // verify books successfully added and listed on profile page
});

test('Successfully delete account', async ({ userLogin, pages }) => {
  userLogin;
  await pages.profilePage.deleteAccount();
});



