import { expect } from '@playwright/test';
import { BaseAPI } from './base.api';
import fs from 'fs';

export class ControllerAPI extends BaseAPI {

  async generateToken(): Promise<string> {
    const tokenResponse = await this.execute({
      method: 'POST',
      url: '/Account/v1/GenerateToken', 
      data: { userName: this.username, password: this.password },
      useAuth: true
    });
    const { token } = await tokenResponse.json();
    return token;
  }

  async generateTokenWithParams(username: string, password: string, statusCode: number): Promise<any> {
    const tokenResponse = await this.execute({
      method: 'POST',
      url: '/Account/v1/GenerateToken', 
      data: { userName: username, password: password },
    });
    expect(tokenResponse.status(), statusCode.toString());
    return await tokenResponse.json();
  }

  async registerUser(): Promise<any> {
    let registerResponse: any;
    let maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        await this.deleteUserIfExist();
        
        registerResponse = await this.execute({
          method: 'POST',
          url: '/Account/v1/User',
          data: { userName: this.username, password: this.password },
          useAuth: false
        });

        const contentType = registerResponse.headers()['content-type'] || '';
        if (!contentType.includes('application/json')) {
          console.warn(`⚠️Expected JSON but got: ${contentType}. Response status: ${registerResponse.status()}`);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          return { error: 'Server returned non-JSON response' };
        }

        const body = await registerResponse.json();
        
        if (body.userID) {
          try {
            const token = await this.generateToken();
            fs.writeFileSync('last_user.json', JSON.stringify({ 
              token: token,
              userID: body.userID 
            }));
          } catch (tokenError) {
            console.error('⚠️Error generating token:', tokenError);
            fs.writeFileSync('last_user.json', JSON.stringify({ userID: body.userID }));
          }
        }
        return body;
      } catch (error) {
        console.error(`📝Registration attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }
    return { error: '🏳️Max registration retries reached' };
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
    console.log('📚Add Books Response:', await response.json());
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
    console.log("👤 Profile response status" + profileResponse.status());
    return profileResponse.status();
  }

  async deleteUser(userId: string): Promise<void> {
    await this.execute({
      method: 'DELETE',
      url: `/Account/v1/User/${userId}`,
      useAuth: true,
    });
  }

  async deleteUserWResp(userId: string): Promise<any> {
    const deleteResponse = await this.execute({
      method: 'DELETE',
      url: `/Account/v1/User/${userId}`,
      useAuth: true,
    });
    console.log('🦆 Status Code for deleting user: ' +  deleteResponse.status());
    return await deleteResponse.json();
  }

  async deleteUserIfExist(): Promise<void> {
    try {
      const fileContent = fs.readFileSync('last_user_id.json', 'utf-8');
      const parsed = JSON.parse(fileContent);
      const lastUserId = parsed.userID;
      
      if (!lastUserId) {
        console.log('🫥No previous user ID found to clean up');
        return;
      }
      
      const profileExist = await this.checkProfileStatus(lastUserId);
      if (profileExist === 200) {
        await this.deleteUser(lastUserId);
        console.log(`🧹Deleted user with ID: ${lastUserId}`);
      }
    } catch (error) {
      console.log('⛔Error cleaning up previous user:', error);
    }
  }

  async getBookISBN(title: string, statusCode: number): Promise<string | null> {
    const getBookResponse = await this.execute({
      method: 'GET',
      url: '/BookStore/v1/Books'
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