import { test } from '../../../fixtures/studentFixtures';

test('Submit registration form with full details', async ({ pages }) => {
  await pages.registrationPage.visit();
  await pages.registrationPage.fillAllFields();
  await pages.registrationPage.submitBtn.click();
  await pages.registrationPage.verifySubmittedValues();
});

test('Submit registration form having only mandatory details', async ({ pages }) => {
  await pages.registrationPage.visit();
  await pages.registrationPage.fillMandatoryFields();
  await pages.registrationPage.submitBtn.click();
});

test('Submit registration with phone number less than 10 digits', async ({ pages }) => {
  await pages.registrationPage.visit();
  await pages.registrationPage.fillMandatoryFields(); 
  await pages.registrationPage.submitBtn.click();
});

test('Submit registration without completing mandatory fields', async ({ pages }) => {
  await pages.registrationPage.visit();
  await pages.registrationPage.fillAllFields(); 
  await pages.registrationPage.submitBtn.click();
});