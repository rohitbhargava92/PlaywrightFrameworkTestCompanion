/**
 * checkoutPageLocators.ts
 * All selectors for the three Checkout steps:
 *   Step 1 — Information (/checkout-step-one.html)
 *   Step 2 — Overview   (/checkout-step-two.html)
 *   Step 3 — Complete   (/checkout-complete.html)
 */

export const checkoutPageLocators = {
  // ── Step 1: Information ────────────────────────────────────────────────────

  /** Page heading — "Checkout: Your Information" */
  title: '.title',

  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  postalCodeInput: '[data-test="postalCode"]',

  /** "Continue" button on the information form */
  continueButton: '[data-test="continue"]',

  /** "Cancel" button on the information form */
  cancelButton: '[data-test="cancel"]',

  /** Validation error message */
  errorMessage: '[data-test="error"]',

  // ── Step 2: Overview ───────────────────────────────────────────────────────

  /** All item names in the order summary */
  summaryItemNames: '.inventory_item_name',

  /** Item total (subtotal before tax) */
  itemTotal: '.summary_subtotal_label',

  /** Tax line */
  taxLabel: '.summary_tax_label',

  /** Grand total */
  totalLabel: '.summary_total_label',

  /** "Finish" button */
  finishButton: '[data-test="finish"]',

  // ── Step 3: Complete ───────────────────────────────────────────────────────

  /** Large confirmation header — "Thank you for your order!" */
  confirmationHeader: '.complete-header',

  /** Confirmation sub-text */
  confirmationText: '.complete-text',

  /** "Back Home" button */
  backHomeButton: '[data-test="back-to-products"]',
};
