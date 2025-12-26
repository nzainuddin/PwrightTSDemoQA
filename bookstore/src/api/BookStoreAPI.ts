import { APIRequestContext, expect } from '@playwright/test';

export class BookStoreAPI {
  private readonly authHeader: Record<string, string>;

  constructor(
    private request: APIRequestContext, 
    private baseURL: string,
    private username: string, 
    private password: string
  ) {
    const authBase64 = Buffer.from(`${username}:${password}`).toString('base64');
    this.authHeader = { 'authorization': `Basic ${authBase64}` };
  }

  private async execute({ method, url, data, customHeaders = {}, useAuth = true }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    customHeaders?: Record<string, string>,
    useAuth?: boolean
  }) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(useAuth ? this.authHeader : {}),
      ...customHeaders
    };

    const requestOptions = { headers: headers, data: data };
    console.log(`Executing ${method} request to ${url} with data:`, data);
    switch (method) {
      case 'GET':    return await this.request.get(this.baseURL + url, requestOptions);
      case 'POST':   return await this.request.post(this.baseURL + url, requestOptions);
      case 'PUT':    return await this.request.put(this.baseURL + url, requestOptions);
      case 'DELETE': return await this.request.delete(this.baseURL + url, requestOptions);
    }
  }

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

  async addBook(userId: string, isbn: string) {
    const response = await this.execute({
      method: 'POST',
      url: '/BookStore/v1/Books',
      data: { userId, collectionOfIsbns: [{ isbn: isbn }] }
    });
    expect(response.status()).toBe(201);
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
  
  async getBookISBN(title: string): Promise<string | null> {
    const getBookResponse = await this.execute({
      method: 'GET',
      url: '/BookStore/v1/Books',
      useAuth: true
    });  
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