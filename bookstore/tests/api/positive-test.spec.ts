import { expect } from '@playwright/test';
import { test } from '../../../fixtures/bookstoreFixtures';

test.describe('Bookstore API Positive Tests', () => {
    test('TC001 - [GET] Successful in fetching book list', async ({ bookstoreAPI }) => {
        const booksResp = await bookstoreAPI.getBookList();
        expect(booksResp.books.length).toBeGreaterThan(0);
    });

    test('TC002 - [POST] Successful in adding single book', async ({ bookstoreAPI }) => {
        // Register a new user
        const userId = await bookstoreAPI.registerUser();
        // Get ISBN for the specified book title
        const isbn = await bookstoreAPI.getBookISBN('Speaking JavaScript');
        // Add the book to the user's collection
        const addBookResp = await bookstoreAPI.addBook(userId, isbn!);
        expect(addBookResp.books[0].isbn).toBe(isbn);
        // Verify book added to user profile
        const profile = await bookstoreAPI.getUserProfile(userId);
        const userBooksCollections = profile.books.map((book: { isbn: string }) => book.isbn);
        expect(userBooksCollections).toContain(isbn);
        // Clean up by deleting the user
        await bookstoreAPI.deleteUser(userId);
    });

    test('TC003 - [POST] Successful in adding multiple books', async ({ bookstoreAPI }) => {
        const bookTitles = ['Git Pocket Guide','Understanding ECMAScript 6', 'Speaking JavaScript'];
        // Register a new user
        const userId = await bookstoreAPI.registerUser();
        // Get ISBNs for the specified book titles
        const isbns = await bookstoreAPI.getBooksISBN(bookTitles);
        // Add the books to the user's collection
        const addBooksResp = await bookstoreAPI.addBooks(userId, isbns!);
        // Verify the added books
        const actualIsbns = addBooksResp.books.map((b: { isbn: string }) => b.isbn);
        expect(actualIsbns).toEqual(expect.arrayContaining(isbns!));
        // Verify books added to user profile
        const profile = await bookstoreAPI.getUserProfile(userId);
        const userBooksCollections = profile.books.map((book: { isbn: string }) => book.isbn);
        expect(userBooksCollections).toEqual(expect.arrayContaining(isbns));
        // Clean up by deleting the user
        await bookstoreAPI.deleteUser(userId);
    });
});