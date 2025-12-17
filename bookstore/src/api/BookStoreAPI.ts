import { APIRequestContext, expect } from '@playwright/test';

export class BookStoreAPI {
  private readonly authHeader: Record<string, string>;

  constructor(
    private request: APIRequestContext, 
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

    switch (method) {
      case 'GET':    return await this.request.get(url, requestOptions);
      case 'POST':   return await this.request.post(url, requestOptions);
      case 'PUT':    return await this.request.put(url, requestOptions);
      case 'DELETE': return await this.request.delete(url, requestOptions);
    }
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

  async registerUser(): Promise<string> {
    const registerResponse = await this.execute({
      method: 'POST',
      url: '/Account/v1/User',
      data: { userName: this.username, password: this.password },
      // customHeaders: { 'Authorization': await this.generateToken() },
      useAuth: false
    });
    console.log(await registerResponse.headers());
    console.log(await registerResponse.body());
    console.log(await registerResponse.json());
    const { userID } = await registerResponse.json();
    return userID;
  }

  async generateToken(): Promise<string> {
    const tokenResponse = await this.execute({
      method: 'POST',
      url: '/Account/v1/GenerateToken', 
      data: { userName: this.username, password: this.password },
      useAuth: false
    });
    console.log(await tokenResponse.json())
    const { token } = await tokenResponse.json();
    return token;
  }
  
  // async getBookISBN(title: string): Promise<string | null> {
  //   const getBooksResponse = await this.request.get('/BookStore/v1/Books');
  //   const booksResult = await getBooksResponse.json();
  //   return booksResult.books
  //       .find((book: { title: string }) => book.title === title)?.isbn || null;
  // }


  // async getBooksISBN(titles: string[]): Promise<string[]> {
  //   const getBooksResponse = await this.request.get('/BookStore/v1/Books');
  //   const booksResult = await getBooksResponse.json();
  //   const allBooks = booksResult.books;

  //   const isbns = titles.map((targetTitle) => {
  //       const matchingBook = allBooks.find(
  //           (book: { title: string }) => book.title === targetTitle
  //       );
  //       return matchingBook?.isbn || '';
  //   });
  //   return isbns;
  // }

  // async addBooksToUser(username: string, password: string, userID: string, token: string, isbns: string[]): Promise<void> {
  //   const collectionOfIsbns = isbns.map(isbn => ({ isbn: isbn }));
  //   const addBooks = await this.request.post('/BookStore/v1/Books', {
  //     headers: { 
  //       authorization: this.createBasicAuthHeader(username, password),
  //       Authorization: `Bearer ${token}` 
  //     },
  //     data: { userId: userID, collectionOfIsbns: collectionOfIsbns },
  //   });
  //   (addBooks.status() === 201) ? console.log(`Successfully added ${isbns.length} books for user ${userID}.`) :
  //     console.error(`Failed to add books. Status: ${addBooks.status()}`);
  // }


  // async addBookToUser(username: string, password: string, userID: string, token: string, isbn: string): Promise<void> {
  //   await this.request.post('/BookStore/v1/Books', {
  //     headers: { 
  //       authorization: this.createBasicAuthHeader(username, password),
  //       Authorization: `Bearer ${token}` 
  //   },
  //     data: { userId: userID, collectionOfIsbns: [{ isbn: isbn }] },
  //   });
  // }
}