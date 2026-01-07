import { Locator, type Page } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
       this.page = page;
       this.userNameInput = page.locator('input#userName');
       this.passwordInput = page.locator('input#password');
       this.loginButton = page.locator('button#login');
    }

    async login(username: string, password: string) {
        await this.page.goto('/login');
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL('/profile');
    }

    
}