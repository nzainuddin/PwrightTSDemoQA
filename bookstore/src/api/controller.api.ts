import { APIRequestContext, expect } from '@playwright/test';
import { BaseAPI } from './base.api';

export class ControllerAPI extends BaseAPI {
  async getBookList() {
    const response = await this.execute({
      method: 'GET',
      url: '/BookStore/v1/Books',
      useAuth: true
    });
    expect(response.status()).toBe(200);
    console.log('Book List Response:', await response.json());
    return response.json();
  }

  async addBooks(userId: string, isbns: string[]) {
    const response = await this.execute({
      method: 'POST',
      url: '/BookStore/v1/Books',
      data: { userId, collectionOfIsbns: isbns.map(isbn => ({ isbn })) }
    });
    expect(response.status()).toBe(201);
    console.log('Add Books Response:', await response.json());
    return response.json();
  }

  async addBook(userId: string, isbn: string, statusCode: number) {
    const response = await this.execute({
      method: 'POST',
      url: '/BookStore/v1/Books',
      data: { userId, collectionOfIsbns: [{ isbn: isbn }] }
    });
    expect(response.status()).toBe(statusCode);
    console.log('Add Books Response:', await response.json());
    return response.json();
  }

  async registerUser(): Promise<string> {
    const registerResponse = await this.execute({
      method: 'POST',
      url: '/Account/v1/User',
      data: { userName: this.username, password: this.password },
      useAuth: false
    });
    const { userID } = await registerResponse.json();
    return userID;
  }

  async getUserProfile(userId: string) {
    const profileResponse = await this.execute({
      method: 'GET',  
      url: `/Account/v1/User/${userId}`,
      useAuth: true
    }); 
    expect(profileResponse.status()).toBe(200);
    console.log('User Profile Response:', await profileResponse.json());
    return profileResponse.json();
  }

  async deleteUser(userId: string): Promise<void> {
    const deleteResponse = await this.execute({
      method: 'DELETE',
      url: `/Account/v1/User/${userId}`,
    });
    expect(deleteResponse.status()).toBe(204);
  }

  async generateToken(): Promise<string> {
    const tokenResponse = await this.execute({
      method: 'POST',
      url: '/Account/v1/GenerateToken', 
      data: { userName: this.username, password: this.password },
      useAuth: false
    });
    const { token } = await tokenResponse.json();
    return token;
  }

  async getBookISBN(title: string, statusCode: number): Promise<string | null> {
    const getBookResponse = await this.execute({
      method: 'GET',
      url: '/BookStore/v1/Books',
      useAuth: true
    });  
    expect(getBookResponse.status()).toBe(statusCode);
    const bookResult = await getBookResponse.json();
    console.log('Response:', bookResult);
    return bookResult.books
        .find((book: { title: string }) => book.title === title)?.isbn || null;
  }

  async getBooksISBN(titles: string[]): Promise<string[]> {
    const getBooksResponse = await this.execute({
      method: 'GET',
      url: '/BookStore/v1/Books',
      useAuth: true
    });
    const booksResult = await getBooksResponse.json();
    console.log('Response:', booksResult);
    const allBooks = booksResult.books;
    const isbns = titles.map((targetTitle) => {
      const matchingBook = allBooks.find((book: { title: string }) => book.title === targetTitle);
      return matchingBook?.isbn || '';
    });
    return isbns;
  }
}