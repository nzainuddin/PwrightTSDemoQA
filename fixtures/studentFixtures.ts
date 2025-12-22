import { test as base } from '@playwright/test';
import { RegistrationPage } from '../student/src/pages/RegistrationPage';
import studentData from '../student/src/common/test-data/json/student.json'

type CustomFixtures = {
  pages: { registrationPage: RegistrationPage; };
  studentData: typeof studentData;
};

export const test = base.extend<CustomFixtures>({
  studentData: async  ({}, use) => { await use(studentData); },
  pages: async ({ page }, use) => {
    await use({
      registrationPage: new RegistrationPage(page)
    })
  },
});