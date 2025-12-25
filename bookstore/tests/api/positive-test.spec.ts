import { expect } from '@playwright/test';
import { test } from '../../../fixtures/bookstoreFixtures';

test.describe('Bookstore API Positive Tests', () => {
    test('TC001 - [POST] Successful in adding single book', async ({ bookstoreAPI, request }) => {
        const userId = await bookstoreAPI.registerUser();
        const isbn = await bookstoreAPI.getBookISBN('Speaking JavaScript');
        const addBookResp = await bookstoreAPI.addBook(userId, isbn!);
        expect(addBookResp.books[0].isbn).toBe(isbn);
        await bookstoreAPI.deleteUser(userId);
    });

    test('TC002 - [POST] Successful in adding multiple books', async ({ bookstoreAPI, request }) => {
        const userId = await bookstoreAPI.registerUser();
        const bookTitles = ['Git Pocket Guide','Understanding ECMAScript 6', 'Speaking JavaScript'];
        const isbns = await bookstoreAPI.getBooksISBN(bookTitles);
        const addBooksResp = await bookstoreAPI.addBooks(userId, isbns!);
        for (let i = 0; i < bookTitles.length; i++) {
            expect(addBooksResp.books[i].isbn).toMatch(isbns[i]);
        }
        await bookstoreAPI.deleteUser(userId);
    });
});