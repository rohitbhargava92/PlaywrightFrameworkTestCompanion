/**
 * login.spec.ts
 * Tests for the Login page.
 * Tags: @smoke (happy path), @regression (all scenarios)
 */

import { test, expect } from '../src/fixtures/baseFixture';
import { loginPageLocators } from '../src/locators/loginPageLocators';
import { readTestData } from '../src/utils/fileUtils';
import { env } from '../src/utils/env';

// Load user credentials from JSON so tests stay data-driven
const users = readTestData<{
  standardUser: { username: string; password: string };
  lockedOutUser: { username: string; password: string };
  invalidUser: { username: string; password: string };
  emptyCredentials: { username: string; password: string };
}>('users.json');

test.describe('Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  test('should log in successfully with valid credentials',
    { tag: ['@smoke', '@regression'] },
    async ({ page, loginPage }) => {
      await loginPage.loginToApplication(env.standardUser, env.password);
      await expect(page).toHaveURL(/inventory/);
    }
  );

  // ── Negative / error scenarios ─────────────────────────────────────────────

  test('should show error for locked-out user',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      await loginPage.loginToApplication(users.lockedOutUser.username, users.lockedOutUser.password);
      await expect(page.locator(loginPageLocators.errorMessage)).toBeVisible();
      await expect(page.locator(loginPageLocators.errorMessage)).toContainText('locked out');
    }
  );

  test('should show error for invalid credentials',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      await loginPage.loginToApplication(users.invalidUser.username, users.invalidUser.password);
      await expect(page.locator(loginPageLocators.errorMessage)).toBeVisible();
      await expect(page.locator(loginPageLocators.errorMessage)).toContainText(
        'Username and password do not match'
      );
    }
  );

  test('should show error when username is empty',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      await loginPage.loginToApplication('', users.standardUser.password);
      await expect(page.locator(loginPageLocators.errorMessage)).toBeVisible();
      await expect(page.locator(loginPageLocators.errorMessage)).toContainText('Username is required');
    }
  );

  test('should show error when password is empty',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      await loginPage.loginToApplication(users.standardUser.username, '');
      await expect(page.locator(loginPageLocators.errorMessage)).toBeVisible();
      await expect(page.locator(loginPageLocators.errorMessage)).toContainText('Password is required');
    }
  );

  test('should show error when both fields are empty',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      await loginPage.loginToApplication(users.emptyCredentials.username, users.emptyCredentials.password);
      await expect(page.locator(loginPageLocators.errorMessage)).toBeVisible();
      await expect(page.locator(loginPageLocators.errorMessage)).toContainText('Username is required');
    }
  );

  test('should dismiss error message when × is clicked',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      await loginPage.loginToApplication(users.invalidUser.username, users.invalidUser.password);
      await expect(page.locator(loginPageLocators.errorMessage)).toBeVisible();
      await loginPage.closeErrorMessage();
      await expect(page.locator(loginPageLocators.errorMessage)).not.toBeVisible();
    }
  );
});
