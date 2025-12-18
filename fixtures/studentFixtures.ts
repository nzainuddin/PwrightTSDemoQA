import { test as base } from '@playwright/test';
import { RegistrationPage } from '../student/src/pages/RegistrationPage';

type CustomFixtures = {
  pages: {
    registrationPage: RegistrationPage;
  };
};

export const test = base.extend<CustomFixtures>({
  pages: async ({ page }, use) => {
    await use({
      registrationPage: new RegistrationPage(page)
    })
  },
});