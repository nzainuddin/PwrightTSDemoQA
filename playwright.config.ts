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
  fullyParallel: true,
  timeout: 120_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { 
      outputFolder: 'reports/html',
      open: 'never' 
    }],
    ['json', { 
      outputFile: 'reports/json/test-results.json' 
    }],
    ['junit', { 
      outputFile: 'reports/junit/results.xml' 
    }],
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
      name: 'boostore-app-chrome',
      testDir: './bookstore/tests/ui',
      outputDir: 'test-results/bookstore-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://demoqa.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      },
    },
    {
      name: 'boostore-app-firefox',
      testDir: './bookstore/tests/ui',
      outputDir: 'test-results/bookstore-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://demoqa.com',
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
        baseURL: 'https://demoqa.com',
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
        baseURL: 'https://demoqa.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry'
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
