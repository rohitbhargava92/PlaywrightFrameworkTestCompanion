/**
 * cartPageLocators.ts
 * All selectors for the Cart page (/cart.html).
 */

export const cartPageLocators = {
  /** Page heading — "Your Cart" */
  title: '.title',

  /** All cart item rows */
  cartItems: '.cart_item',

  /** All item name labels in the cart */
  itemNames: '.inventory_item_name',

  /** All item price labels in the cart */
  itemPrices: '.inventory_item_price',

  /** "Continue Shopping" button */
  continueShoppingButton: '[data-test="continue-shopping"]',

  /** "Checkout" button */
  checkoutButton: '[data-test="checkout"]',

  /**
   * "Remove" button for a specific cart item.
   *
   * @param productName - The exact product name as shown in the UI.
   * @returns A CSS attribute selector string.
   */
  removeButton: (productName: string): string => {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `[data-test="remove-${slug}"]`;
  },
};
