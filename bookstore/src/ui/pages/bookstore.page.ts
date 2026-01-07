import { Locator, type Page } from '@playwright/test';

export class BookStorePage {
    private readonly page: Page;
    readonly searchInput: Locator;

    constructor(page: Page) {
       this.page = page;
       this.searchInput = page.locator('#searchBox');
    }

    async search(searchTerm: string) {
        await this.searchInput.fill(searchTerm);
    }
}
