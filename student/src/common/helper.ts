import { expect, Locator } from "@playwright/test";

export class Helper {
  async assertTextOnceVisible(elementLocator: Locator, text: string, timeout: number = 5000) {
    await elementLocator.waitFor({ state: 'visible', timeout });
    console.log(elementLocator.getAttribute('innerText'));
    await expect(elementLocator).toHaveText(text, { timeout });
  }
}