import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/index';

test.describe('Bookstore API Negative Tests', () => {
    test('TC010 - Verify unable retrieve ISBN for non-existent book title', async ({ controllerAPI }) => {
        await controllerAPI.getBookISBN('Speaking JavaScripts', 200);
    });

    test('TC011 - Verify user is unable to add incorrect ISBN', async ({ controllerAPI }) => {
        const { userID } = await controllerAPI.registerUser();
        await controllerAPI.addBook(userID, "XXX123456", true, 400);
        const profile = await controllerAPI.getUserProfile(userID);
        const userBooksCollections = profile.books.map((book: { isbn: string }) => book.isbn);
        expect(userBooksCollections).not.toContain("XXX123456");
    });

    test('TC012 - Verify user is unable to add duplicate books', async ({ controllerAPI }) => {
        const { userID } = await controllerAPI.registerUser(); 
        const isbn = await controllerAPI.getBookISBN('Speaking JavaScript', 200);

        const addBookResp1 = await controllerAPI.addBook(userID, isbn!, true, 201);   
        expect(addBookResp1.books[0].isbn).toBe(isbn);

        await controllerAPI.addBook(userID, isbn!, true, 400);

        const profile = await controllerAPI.getUserProfile(userID);
        const userBooksCollections = profile.books.map((book: { isbn: string }) => book.isbn);
        const occurrences = userBooksCollections.filter((bookIsbn: string) => bookIsbn === isbn).length;
        expect(occurrences).toBe(1);
    });

    test('TC013 - Verify user is unable to add books with invalid userId', async ({ controllerAPI }) => {
        const isbn = await controllerAPI.getBookISBN('Speaking JavaScript', 200);
        await controllerAPI.addBook("invalidUserId", isbn!, true, 401);
    });

    test('TC014 - Verify user is unable to generate token with incorrect credentials', async ({ controllerAPI, credentials }) => {
    });

    test('TC015 - Verify user is unable to register with existing username', async ({ controllerAPI, credentials }) => {
        // Register User Response Body: { code: '1204', message: 'User exists!' }
        // Register User Response Status: 406

        // Register User Response Body: { code: '1204', message: 'User ex
        // Register User Response Body: { code: '1204', message: 'User exists!' }

    });

    test('TC016 - Verify unable to delete non-existent user', async ({ controllerAPI }) => {
    });

    test('TC017 - Verify unable to fetch profile of non-existent user', async ({ controllerAPI }) => {
    });

    test('TC018 - Verify non-authorized user unable to add books', async ({ controllerAPI }) => {
        const { userID } = await controllerAPI.registerUser(); 
        const isbn = await controllerAPI.getBookISBN('Speaking JavaScript', 200);
        await controllerAPI.addBook(userID, isbn!, false, 401);   
    });

});