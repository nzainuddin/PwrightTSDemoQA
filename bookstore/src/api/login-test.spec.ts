import { APIRequestContext } from '@playwright/test';

interface UserData {
  userID: string;
  token: string;
  username: string;
}

export class BookStoreAPI {
  private request: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.request = requestContext
  }

  async createBasicAuthHeader(username: string, password: string): Promise<string> {
    const credentials = `${username}:${password}`;
    // Base64 encode the credentials string
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

  async registerUser(username: string, password: string): Promise<{ userID: string }> {
    const registerResponse = await this.request.post('/Account/v1/User', {
      data: { userName: username, password: password },
    });
    const { userID } = await registerResponse.json();
    return { userID };
  }

  async generateToken(username: string, password: string): Promise<string> {
    const tokenResponse = await this.request.post('/Account/v1/GenerateToken', {
      data: { userName: username, password: password },
    });
    const { token } = await tokenResponse.json();
    return token;
  }
  
  async getBookISBN(title: string): Promise<string | null> {
    const getBooksResponse = await this.request.get('/BookStore/v1/Books');
    const booksResult = await getBooksResponse.json();
    return booksResult.books
        .find((book: { title: string }) => book.title === title)?.isbn || null;
  }

  async addBookToUser(userID: string, token: string, isbn: string): Promise<void> {
    await this.request.post('/BookStore/v1/Books', {
      headers: { 
        authorization: createBasicAuthHeader(),
        Authorization: `Bearer ${token}` 
    },
      data: {
        userId: userID,
        collectionOfIsbns: [{ isbn: isbn }],
      },
    });

  }
}