import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://demoqa.com',
    trace: 'on-first-retry',
  },
  projects: [
    // -------------------------------------------------------------------
    //                       Configuration: Bookstore App
    // -------------------------------------------------------------------
    {
      name: 'boostore-app-chrome',
      testDir: './bookstore/tests/ui',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001', // App 1's distinct server port
      },
    },
    {
      name: 'boostore-app-firefox',
      testDir: './bookstore/tests/ui', // Use the same test files
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3002',
      },
    },

    // -------------------------------------------------------------------
    //                       Configuration: Student App
    // -------------------------------------------------------------------
    {
      name: 'student-app-chrome',
      testDir: './student/tests/ui',
      use: {
        launchOptions: {
          args: ['--disable-site-isolation-trials'], 
      },
        ...devices['Desktop Chrome'],
        baseURL: 'https://demoqa.com',
        trace: 'on-first-retry',
      }
    },
    {
      name: 'student-app-firefox',
      testDir: './student/tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://demoqa.com',
        trace: 'on-first-retry',
      },
    },
  ],
  
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
