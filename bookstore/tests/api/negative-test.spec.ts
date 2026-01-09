import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/index';

test.describe('Bookstore API Negative Tests', () => {
    test('TC010 - Very unable retrieve ISBN for non-existent book title', async ({ controllerAPI }) => {
        // Register a new user and get ISBN for the specified book title
        const userId = await controllerAPI.registerUser();
        const isbn = await controllerAPI.getBookISBN('Speaking JavaScripts', 404);
        // Clean up by deleting the user
        await controllerAPI.deleteUser(userId);
    });

    test('TC011 - Verify user is unable to add incorrect ISBN', async ({ controllerAPI }) => {
        // Register a new user and get ISBN for the specified book title
        const userId = await controllerAPI.registerUser();
        const isbn = await controllerAPI.getBookISBN('Speaking JavaScript', 200);
        // Add book with incorrect ISBN to the user's collection
        const addBookResp = await controllerAPI.addBook(userId, isbn?.replace(isbn.charAt(0), 'X')!, 400);
        // Verify book does not get added
        const profile = await controllerAPI.getUserProfile(userId);
        const userBooksCollections = profile.books.map((book: { isbn: string }) => book.isbn);
        expect(userBooksCollections).not.toContain(isbn);
        // Clean up by deleting the user
        await controllerAPI.deleteUser(userId);
    });
});