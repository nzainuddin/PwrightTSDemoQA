import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/index';

test.describe('Bookstore API Positive Tests', () => {
    test('TC001 - [GET] Successful in fetching book list', async ({ controllerAPI }) => {
        const booksResp = await controllerAPI.getBookList();
        expect(booksResp.books.length).toBeGreaterThan(0);
    });

    test('TC002 - [POST] Successful in adding single book', async ({ controllerAPI }) => {
        const { userID } = await controllerAPI.registerUser();
        console.log("User ID on test: " + userID);
        const isbn = await controllerAPI.getBookISBN('Speaking JavaScript', 200);
        const addBookResp = await controllerAPI.addBook(userID, isbn!, true, 201);
        expect(addBookResp.books[0].isbn).toBe(isbn);

        const profile = await controllerAPI.getUserProfile(userID);
        const userBooksCollections = profile.books.map((book: { isbn: string }) => book.isbn);
        expect(userBooksCollections).toContain(isbn);
    });

    test('TC003 - [POST] Successful in adding multiple books', async ({ controllerAPI }) => {
        const bookTitles = ['Git Pocket Guide','Understanding ECMAScript 6', 'Speaking JavaScript'];

        const { userID } = await controllerAPI.registerUser();
        const isbns = await controllerAPI.getBooksISBN(bookTitles);
        const addBooksResp = await controllerAPI.addBooks(userID, isbns!);
        const actualIsbns = addBooksResp.books.map((b: { isbn: string }) => b.isbn);
        expect(actualIsbns).toEqual(expect.arrayContaining(isbns!));
        
        const profile = await controllerAPI.getUserProfile(userID);
        const userBooksCollections = profile.books.map((book: { isbn: string }) => book.isbn);
        expect(userBooksCollections).toEqual(expect.arrayContaining(isbns));
    });
});