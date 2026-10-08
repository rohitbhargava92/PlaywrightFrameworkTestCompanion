/**
 * LoginPage.ts
 * Actions for the Login page (/).
 * Selectors live in loginPageLocators.ts — never define them here.
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginPageLocators } from '../locators/loginPageLocators';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Fills in the username and password fields, then clicks the login button.
   * Wrapped in test.step() so it appears as a named step in Allure reports.
   *
   * @param username - The username to enter.
   * @param password - The password to enter.
   */
  async loginToApplication(username: string, password: string): Promise<void> {
    return this.step(`Login as "${username}"`, async () => {
      logger.step(`Logging in as: ${username}`);
      await this.page.fill(loginPageLocators.username, username);
      await this.page.fill(loginPageLocators.password, password);
      logger.info('Clicking login button');
      await this.page.click(loginPageLocators.loginButton);
    });
  }

  /**
   * Returns the text of the error message banner.
   * Call this after a failed login attempt.
   *
   * @returns The error message string.
   */
  async getErrorMessage(): Promise<string> {
    return this.step('Get login error message', async () => {
      logger.info('Reading login error message');
      return this.getText(loginPageLocators.errorMessage);
    });
  }

  /**
   * Dismisses the error banner by clicking the × button.
   */
  async closeErrorMessage(): Promise<void> {
    return this.step('Close error message banner', async () => {
      logger.info('Closing error message banner');
      await this.page.click(loginPageLocators.errorCloseButton);
    });
  }
}
