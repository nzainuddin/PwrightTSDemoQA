import { test } from '../../../fixtures/fixtures';

test('Submit registration form having only mandatory details', async ({ registrationPage }) => {
  await registrationPage.visit();
  await registrationPage.fillMandatoryFields();
  await registrationPage.submitBtn.click();
});

test('Submit registration form with full details', async ({ registrationPage }) => {
  await registrationPage.visit();
  await registrationPage.fillAllFields();
  await registrationPage.submitBtn.click();
});

test('Submit registration with phone number less than 10 digits', async ({ registrationPage }) => {
  await registrationPage.visit();
  await registrationPage.fillMandatoryFields(); 
  await registrationPage.submitBtn.click();
});

test('Submit registration without completing mandatory fields', async ({ registrationPage }) => {
  await registrationPage.visit();
  await registrationPage.fillAllFields(); 
  await registrationPage.submitBtn.click();
});