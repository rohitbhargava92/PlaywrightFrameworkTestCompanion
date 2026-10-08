/**
 * BasePage.ts
 * Shared low-level browser actions used by every page class.
 * Page-specific classes extend this so they inherit these helpers
 * without duplicating them.
 *
 * test.step() is exposed here as a protected helper so every page method
 * can wrap its body in a named Allure step with a single call.
 */

import { Page, test } from '@playwright/test';
import { logger } from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) { }

  /**
   * Wraps a callback in a Playwright test.step() so it appears as a
   * named step in Allure (and the built-in HTML) reports.
   *
   * @param name     - Human-readable step name shown in the report.
   * @param callback - The async work to perform inside the step.
   * @returns Whatever the callback returns.
   */
  protected async step<T>(name: string, callback: () => Promise<T>): Promise<T> {
    return test.step(name, callback);
  }

  /**
   * Navigates to a path relative to the configured baseURL.
   *
   * @param path - URL path, e.g. "/inventory.html"
   */
  async navigateTo(path: string): Promise<void> {
    return this.step(`Navigate to ${path}`, async () => {
      logger.info(`Navigating to: ${path}`);
      await this.page.goto(path);
    });
  }

  /**
   * Returns the trimmed visible text of the first element matching the selector.
   *
   * @param selector - CSS selector string.
   * @returns The element's inner text.
   */
  async getText(selector: string): Promise<string> {
      logger.info(`Getting text from: ${selector}`);
      return (await this.page.locator(selector).innerText()).trim();
  }

  /**
   * Clicks the first element matching the selector.
   *
   * @param selector - CSS selector string.
   */
  async clickElement(selector: string): Promise<void> {
    return this.step(`Click element: ${selector}`, async () => {
      logger.info(`Clicking element: ${selector}`);
      await this.page.locator(selector).click();
    });
  }

  /**
   * Returns the current page URL.
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Returns the inner texts of all elements matching the selector.
   *
   * @param selector - CSS selector string.
   * @returns Array of trimmed text strings.
   */
  async getAllTexts(selector: string): Promise<string[]> {
    logger.info(`Getting all texts from: ${selector}`);
    return this.page.locator(selector).allInnerTexts();
  }

  /**
   * Returns the count of elements matching the selector.
   *
   * @param selector - CSS selector string.
   */
  async getCount(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }
}
