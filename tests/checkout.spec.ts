/**
 * checkout.spec.ts
 * Tests for the full checkout flow and field validation.
 * Tags: @smoke (E2E purchase), @regression (all scenarios)
 */

import { test, expect } from '../src/fixtures/baseFixture';
import { checkoutPageLocators } from '../src/locators/checkoutPageLocators';
import { readTestData } from '../src/utils/fileUtils';

const checkoutData = readTestData<{
  validCustomer: { firstName: string; lastName: string; postalCode: string };
  missingFirstName: { firstName: string; lastName: string; postalCode: string };
  missingLastName: { firstName: string; lastName: string; postalCode: string };
  missingPostalCode: { firstName: string; lastName: string; postalCode: string };
}>('checkoutData.json');

test.describe('Checkout Flow', () => {

  test.beforeEach(async ({ loggedInPage: _ }) => {
    // loggedInPage fixture handles navigation + login automatically
  });

  // ── Full E2E purchase ──────────────────────────────────────────────────────

  test('should complete a full purchase successfully',
    { tag: ['@smoke', '@regression'] },
    async ({ productsPage, cartPage, checkoutPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.addToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();
      await cartPage.proceedToCheckout();

      const { firstName, lastName, postalCode } = checkoutData.validCustomer;
      await checkoutPage.fillInformation(firstName, lastName, postalCode);

      await expect(page).toHaveURL(/checkout-step-two/);
      const itemNames = await checkoutPage.getOverviewItemNames();
      expect(itemNames).toContain('Sauce Labs Backpack');
      expect(itemNames).toContain('Sauce Labs Bike Light');

      await checkoutPage.finishCheckout();

      await expect(page).toHaveURL(/checkout-complete/);
      await expect(page.locator(checkoutPageLocators.confirmationHeader)).toHaveText(
        'Thank you for your order!'
      );
    }
  );

  // ── Checkout field validation (parameterized) ──────────────────────────────

  const validationCases = [
    {
      label: 'missing first name',
      data: () => checkoutData.missingFirstName,
      expectedError: 'First Name is required',
    },
    {
      label: 'missing last name',
      data: () => checkoutData.missingLastName,
      expectedError: 'Last Name is required',
    },
    {
      label: 'missing postal code',
      data: () => checkoutData.missingPostalCode,
      expectedError: 'Postal Code is required',
    },
  ];

  for (const { label, data, expectedError } of validationCases) {
    test(`should show error for ${label}`,
      { tag: '@regression' },
      async ({ productsPage, cartPage, page }) => {
        await productsPage.addToCart('Sauce Labs Backpack');
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();

        const { firstName, lastName, postalCode } = data();
        await page.fill(checkoutPageLocators.firstNameInput, firstName);
        await page.fill(checkoutPageLocators.lastNameInput, lastName);
        await page.fill(checkoutPageLocators.postalCodeInput, postalCode);
        await page.click(checkoutPageLocators.continueButton);

        await expect(page.locator(checkoutPageLocators.errorMessage)).toBeVisible();
        await expect(page.locator(checkoutPageLocators.errorMessage)).toContainText(expectedError);
      }
    );
  }

  // ── Cancel checkout ────────────────────────────────────────────────────────

  test('should return to cart when Cancel is clicked on the information form',
    { tag: '@regression' },
    async ({ productsPage, cartPage, checkoutPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.cancelCheckout();
      await expect(page).toHaveURL(/cart/);
    }
  );

  // ── Back home ──────────────────────────────────────────────────────────────

  test('should return to products page after completing an order',
    { tag: '@regression' },
    async ({ productsPage, cartPage, checkoutPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.proceedToCheckout();

      const { firstName, lastName, postalCode } = checkoutData.validCustomer;
      await checkoutPage.fillInformation(firstName, lastName, postalCode);
      await checkoutPage.finishCheckout();
      await checkoutPage.backToHome();

      await expect(page).toHaveURL(/inventory/);
    }
  );
});