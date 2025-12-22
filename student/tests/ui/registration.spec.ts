import { test } from '../../../fixtures/studentFixtures';

test('Submit registration form with full details', async ({ pages, studentData }) => {
  await pages.registrationPage.visit();
  await pages.registrationPage.fillAllFields(studentData);
  await pages.registrationPage.submitBtn.click();
  await pages.registrationPage.verifySubmittedValues('Full');
});

test('Submit registration form having only mandatory details', async ({ pages, studentData }) => {
  await pages.registrationPage.visit();
  await pages.registrationPage.fillMandatoryFields(studentData);
  await pages.registrationPage.submitBtn.click();
  await pages.registrationPage.verifySubmittedValues('Mandatory');
});