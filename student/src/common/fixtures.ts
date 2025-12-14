import { test as base } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';

type CustomFixtures = {
  registrationPage: RegistrationPage;
};

export const test = base.extend<CustomFixtures>({
  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },
});