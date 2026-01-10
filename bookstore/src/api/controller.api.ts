import { APIRequestContext, expect } from '@playwright/test';
import { BaseAPI } from './base.api';
import fs from 'fs';

export class ControllerAPI extends BaseAPI {

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

  async registerUser(): Promise<any> {
    await this.deleteUserIfExist();
    const registerResponse = await this.execute({
      method: 'POST',
      url: '/Account/v1/User',
      data: { userName: this.username, password: this.password },
      useAuth: false
    });
    const body = await registerResponse.json();
    if (body.userID) {
      const token = await this.generateToken();
      fs.writeFileSync('last_token.json', JSON.stringify({ token }));
      fs.writeFileSync('last_user_id.json', JSON.stringify({ userID: body.userID }));
      console.log("Write both token and userId: " + token + "-" + body.userID);
    }
    return body;
  }

  async getBookList() {
    const response = await this.execute({
      method: 'GET',
      url: '/BookStore/v1/Books',
      useAuth: true
    });
    expect(response.status()).toBe(200);
    return response.json();
  }

  async addBooks(userId: string, isbns: string[]) {
    const response = await this.execute({
      method: 'POST',
      url: '/BookStore/v1/Books',
      data: { userId, collectionOfIsbns: isbns.map(isbn => ({ isbn })) }
    });
    expect(response.status()).toBe(201);
    return response.json();
  }

  async addBook(userId: string, isbn: string, setAuth: boolean, statusCode: number) {
    const response = await this.execute({
      method: 'POST',
      url: '/BookStore/v1/Books',
      data: { userId, collectionOfIsbns: [{ isbn: isbn }] },
      useAuth: setAuth
    });
    expect(response.status()).toBe(statusCode);
    console.log('Add Books Response:', await response.json());
    return response.json();
  }

  async getUserProfile(userId: string) {
    const profileResponse = await this.execute({
      method: 'GET',  
      url: `/Account/v1/User/${userId}`,
      useAuth: true
    }); 
    return profileResponse.json();
  }

  async checkProfileStatus(userId: string) {
    const profileResponse = await this.execute({
      method: 'GET',  
      url: `/Account/v1/User/${userId}`,
      useAuth: true
    }); 
    console.log("Profile response status" + profileResponse.status());
    return profileResponse.status();
  }

  async deleteUser(userId: string): Promise<void> {
    await this.execute({
      method: 'DELETE',
      url: `/Account/v1/User/${userId}`,
      useAuth: true,
    });
  }

  async deleteUserIfExist(): Promise<void> {
    const lastUserId = fs.readFileSync('last_user_id.json', 'utf-8').toString().replace(/["{}]/g, '').split(':')[1];
    const profileExist = await this.checkProfileStatus(lastUserId);
    if (profileExist === 200) {
      await this.deleteUser(lastUserId);
      console.log(`Deleted user with ID: ${lastUserId}`);
    }
  }

  async getBookISBN(title: string, statusCode: number): Promise<string | null> {
    const getBookResponse = await this.execute({
      method: 'GET',
      url: '/BookStore/v1/Books',
      // useAuth: true
    });  
    expect(getBookResponse.status()).toBe(statusCode);
    const bookResult = await getBookResponse.json();
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