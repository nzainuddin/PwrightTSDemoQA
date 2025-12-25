import { expect, Locator } from "@playwright/test";

export class Helper {
  async assertTextOnceVisible(elementLocator: Locator, text: string, timeout: number = 5000) {
    await elementLocator.waitFor({ state: 'visible', timeout });
    await expect(elementLocator).not.toBeEmpty({ timeout });
    await expect(elementLocator).toHaveText(text, { timeout });
  }
}