import { Locator, type Page } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly captchaCheckbox: Locator;
    readonly registerButton: Locator;
    readonly backToLoginButton: Locator;


    constructor(page: Page) {
       this.page = page;
       this.firstNameInput = page.locator('input#firstname');
       this.lastNameInput = page.locator('input#lastname');
       this.userNameInput = page.locator('input#userName');
       this.passwordInput = page.locator('input#password');
       this.captchaCheckbox = page.locator('.recaptcha-checkbox-border');
       this.registerButton = page.locator('button#register');
       this.backToLoginButton = page.getByRole('button', { 'name': 'Back to Login' });
    }

    async register(firstname: string, lastname: string, username: string, password: string) {
        await this.firstNameInput.fill(firstname);
        await this.lastNameInput.fill(lastname);
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.captchaCheckbox.click();
        await this.registerButton.click();
        await this.backToLoginButton.click();
    }
}