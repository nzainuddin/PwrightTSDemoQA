import { expect, Locator, type Page } from '@playwright/test';
import testData from '../common/test-data/json/student.json';
import * as path from 'path';
import { assert } from 'console';

export class RegistrationPage {
   private readonly page: Page;
   readonly firstnameInput: Locator;
   readonly lastnameInput: Locator;
   readonly emailInput: Locator;
   readonly genderRadioBtn: Locator;
   readonly mobileInput: Locator;
   readonly dateOfBirthDatePicker: Locator;
   readonly subjectsInput: Locator;
   readonly hobbiesCBox: Locator;
   readonly pictureUploadLabel: Locator;
   readonly pictureUploadInput: Locator;
   readonly addressTextArea: Locator;
   readonly stateDropdown: Locator;
   readonly cityDropdown: Locator;
   readonly submitBtn: Locator;
   readonly studentNameTxt: Locator;
   readonly studentEmailTxt: Locator;
   readonly genderTxt: Locator;
   readonly mobileTxt: Locator;
   readonly dobTxt: Locator;
   readonly subjectsTxt: Locator;
   readonly hobbiesTxt: Locator;
   readonly pictureTxt: Locator;
   readonly addressTxt: Locator;
   readonly statecityTxt: Locator;


    constructor(page: Page) {
       this.page = page;
       this.firstnameInput = page.getByPlaceholder("First Name");
       this.lastnameInput = page.getByPlaceholder("Last Name");
       this.emailInput = page.locator("#userEmail");
       this.genderRadioBtn = page.getByLabel("Gender")
       this.mobileInput = page.locator("#userNumber");
       this.dateOfBirthDatePicker = page.getByLabel("Date of Birth");
       this.subjectsInput = page.locator("#subjectsInput");
       this.hobbiesCBox = page.getByLabel("Hobbies");
       this.pictureUploadLabel = page.locator("label.form-file-label");
       this.pictureUploadInput = page.locator("input#uploadPicture");
       this.addressTextArea = page.locator("#currentAddress");
       this.stateDropdown = page.getByText("Select State");
       this.cityDropdown = page.locator("#city");
       this.submitBtn = page.getByRole('button', { name: 'Submit' });
       this.studentNameTxt = page.locator("//td[text()='Student Name']/following-sibling::td");
       this.studentEmailTxt = page.locator("//td[text()='Student Email']/following-sibling::td");
       this.genderTxt = page.locator("//td[text()='Gender']/following-sibling::td");
       this.mobileTxt = page.locator("//td[text()='Mobile']/following-sibling::td");
       this.dobTxt = page.locator("//td[text()='Date of Birth']/following-sibling::td");
       this.subjectsTxt = page.locator("//td[text()='Subjects']/following-sibling::td");
       this.hobbiesTxt = page.locator("//td[text()='Hobbies']/following-sibling::td");
       this.pictureTxt = page.locator("//td[text()='Picture']/following-sibling::td");
       this.addressTxt = page.locator("//td[text()='Address']/following-sibling::td");
       this.statecityTxt = page.locator("//td[text()='State and City']/following-sibling::td");
    }

    async visit() {
        await this.page.goto('/automation-practice-form');
    }

    async fillMandatoryFields() {
        await this.firstnameInput.fill("John");
        await this.lastnameInput.fill("Doe");
        await this.page.getByText('Male', { exact: true }).click();
        await this.mobileInput.fill("1234567890");  
    }

    async uploadPicture() {
        const IMAGE_DIR = 'student/src/common/test-data/image';
        const IMAGE_FILENAME = 'ck.jpg';

        const ABSOLUTE_IMAGE_PATH = path.join(process.cwd(), IMAGE_DIR, IMAGE_FILENAME);
        await this.pictureUploadLabel.waitFor({ state: 'visible', timeout: 15000 });
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser', { timeout: 15000 }),
            this.pictureUploadLabel.click({ timeout: 10000 })
        ]);
        await fileChooser.setFiles(ABSOLUTE_IMAGE_PATH);
        console.log(`✅ Success! 📁 File uploaded and form submitted.`);
    }


    async fillAllFields() {
        await this.firstnameInput.fill(testData.firstname);
        await this.lastnameInput.fill(testData.lastname);
        await this.emailInput.fill(testData.email);
        await this.page.getByText(testData.gender, { exact: true }).click();
        await this.mobileInput.fill(testData.mobile);
        await this.subjectsInput.fill(testData.subject);
        await this.page.keyboard.press('Tab');
        await this.page.getByText(testData.hobbies).click();
        await this.uploadPicture();
        await this.addressTextArea.fill(testData.address);
        await this.stateDropdown.click();
        await this.page.getByText(testData.state, { exact: true }).click();
        await this.cityDropdown.click();
        await this.page.getByText(testData.city, { exact: true }).click();
    }

    async verifySubmittedValues() {
        await expect(this.studentNameTxt).toHaveText(testData.firstname + " " + testData.lastname);
        await expect(this.studentEmailTxt).toHaveText(testData.email);
        await expect(this.genderTxt).toHaveText(testData.gender);
        await expect(this.mobileTxt).toHaveText(testData.mobile);
        await expect(this.dobTxt).toHaveText("");
        await expect(this.subjectsTxt).toHaveText(testData.subject);
        await expect(this.hobbiesTxt).toHaveText(testData.hobbies);
        await expect(this.pictureTxt).toHaveText(testData.imagePath);
        await expect(this.addressTxt).toHaveText(testData.address);
        await expect(this.statecityTxt).toHaveText(testData.state + " " + testData.city);
    }
}