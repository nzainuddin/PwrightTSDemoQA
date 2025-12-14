import { Locator, type Page } from '@playwright/test';
import * as path from 'path';

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

        const ABSOLUTE_IMAGE_PATH = path.join(
            process.cwd(), 
            IMAGE_DIR, 
            IMAGE_FILENAME
        );
        await this.pictureUploadLabel.waitFor({ state: 'visible', timeout: 15000 });
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser', { timeout: 15000 }),
            this.pictureUploadLabel.click({ timeout: 10000 })
        ]);
        await fileChooser.setFiles(ABSOLUTE_IMAGE_PATH);
        console.log(`✅ Success! 📁 File uploaded and form submitted.`);
    }


    async fillAllFields() {
        await this.firstnameInput.fill("John");
        await this.lastnameInput.fill("Doe");
        await this.emailInput.fill("lina@email.com");
        await this.page.getByText('Male', { exact: true }).click();
        await this.mobileInput.fill("1234567890");
        await this.subjectsInput.fill("Maths");
        await this.page.keyboard.press('Tab');
        await this.page.getByText('Sports').click();
        await this.uploadPicture();
        await this.addressTextArea.fill("123 Main St, Anytown, USA");
        await this.stateDropdown.click();
        await this.page.getByText('NCR', { exact: true }).click();
        await this.cityDropdown.click();
        await this.page.getByText("Delhi", { exact: true }).click();
    }
}