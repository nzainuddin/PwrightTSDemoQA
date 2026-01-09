import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

(!process.env.BOOKSTORE_BASE_URL) ?
  console.error('❌ ERROR: .env file not found or BOOKSTORE_BASE_URL is missing!') :
  console.log('✅ Environment variables loaded successfully.');
(!process.env.BOOKSTORE_USERNAME) ?
  console.error('❌ ERROR: .env file not found or BOOKSTORE_USERNAME is missing!') :
  console.log('✅ Environment variables loaded successfully.');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 120_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { 
      outputFolder: 'reports',
      open: 'never' 
    }],
    ['json', { outputFile: 'reports/json/test-results.json' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['list'],
    // GitHub Actions reporter
    process.env.CI ? ['github'] : ['line'],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // -------------------------------------------------------------------
    //                       Configuration: Bookstore App
    // -------------------------------------------------------------------
    {
      name: 'bookstore-app-chrome',
      testDir: './bookstore/tests',
      outputDir: 'test-results/bookstore-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.BOOKSTORE_BASE_URL || 'https://demoqa.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      },
    },
    {
      name: 'bookstore-app-firefox',
      testDir: './bookstore/tests',
      outputDir: 'test-results/bookstore-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.BOOKSTORE_BASE_URL || 'https://demoqa.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      },
    },

    // -------------------------------------------------------------------
    //                       Configuration: Student App
    // -------------------------------------------------------------------
    {
      name: 'student-app-chrome',
      testDir: './student/tests/ui',
      outputDir: 'test-results/student-chrome',
      use: {
        launchOptions: {
          args: ['--disable-site-isolation-trials'], 
      },
        ...devices['Desktop Chrome'],
        baseURL: process.env.BOOKSTORE_BASE_URL || 'https://demoqa.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
      }
    },
    {
      name: 'student-app-firefox',
      testDir: './student/tests/ui',
      outputDir: 'test-results/student-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.BOOKSTORE_BASE_URL || 'https://demoqa.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry'
      },
    },
  ],
});
