import { Locator, type Page, request } from '@playwright/test';

export class ProfilePage {
    private readonly page: Page;
    readonly deleteAccButton: Locator;
    readonly confirmationDeleteAccModal: Locator;
    readonly okDeleteAccButton: Locator;

    constructor(page: Page) {
       this.page = page;
       this.deleteAccButton = page.getByRole('button', { name: 'Delete Account' });
       this.confirmationDeleteAccModal = page.locator('//*[starts-with(@class,"modal")][text()="Do you want to delete your account?"]');
       this.okDeleteAccButton = page.getByRole('button', { name: 'OK'});
    }

    async deleteBook(bookTitle: string) {
        const bookToBeDeleted = this.page.locator('//*[@class="rt-table"]//div[@class="rt-tr-group" and .//span[text()='+bookTitle+']]');
        const deleteIcon = bookToBeDeleted.locator('[title="Delete"]');
        await deleteIcon.click();
    }

    async deleteAccount() {
        await this.deleteAccButton.click();
        await this.confirmationDeleteAccModal.waitFor({ state: 'visible', timeout: 5000});
        await this.okDeleteAccButton.click();
        await this.page.keyboard.press('Enter');
        await this.page.waitForURL('/login');
    }
}