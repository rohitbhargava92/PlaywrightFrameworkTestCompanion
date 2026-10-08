/**
 * loginPageLocators.ts
 * All selectors for the Login page (/index.html).
 * Prefer [data-test] attributes and IDs — they are the most stable.
 */

export const loginPageLocators = {
  username: '#user-name',
  password: '#password',
  loginButton: '#login-button',

  /** Error message banner shown on failed login */
  errorMessage: '[data-test="error"]',

  /** The × button inside the error banner */
  errorCloseButton: '.error-button',
};
