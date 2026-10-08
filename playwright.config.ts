import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env (ignored in CI where vars are injected directly)
dotenv.config();

export default defineConfig({
  // ── Global settings ──────────────────────────────────────────────────────────
  testDir: './tests',
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in source
  forbidOnly: !!process.env.CI,

  // Retry failed tests twice on CI, never locally
  retries: process.env.CI ? 2 : 0,

  // Use 2 workers on CI to stay within free-tier limits; unlimited locally
  workers: process.env.CI ? 2 : undefined,

  // ── Reporters ────────────────────────────────────────────────────────────────
  // html  → open with `npm run report`
  // allure → generate + open with `npm run allure:report`
  // list  → live console output during the run
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: true }],
  ],

  // ── Global setup / teardown ──────────────────────────────────────────────────
  globalSetup: './src/global/global-setup.ts',
  globalTeardown: './src/global/global-teardown.ts',

  // ── Shared browser options ───────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',

    // Capture a screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Keep video for failed tests so you can replay what went wrong
    video: 'retain-on-failure',

    // Record a trace on the first retry so you can inspect the failure
    trace: 'on-first-retry',
  },

  // ── Timeouts (all in milliseconds) ───────────────────────────────────────────
  timeout: 30_000,          // per-test timeout
  expect: {
    timeout: 5_000,         // web-first assertion timeout
  },

  // ── Browser projects ─────────────────────────────────────────────────────────
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
