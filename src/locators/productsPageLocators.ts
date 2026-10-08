/**
 * productsPageLocators.ts
 * All selectors for the Products / Inventory page (/inventory.html).
 */

export const productsPageLocators = {
  /** Page heading — "Products" */
  title: '.title',

  /** The sort dropdown */
  sortDropdown: '[data-test="product-sort-container"]',

  /** All product name labels */
  productNames: '.inventory_item_name',

  /** All product price labels */
  productPrices: '.inventory_item_price',

  /** All product cards */
  productItems: '.inventory_item',

  /** Shopping cart icon in the top-right */
  cartIcon: '.shopping_cart_link',

  /** Badge showing the number of items in the cart */
  cartBadge: '.shopping_cart_badge',

  /** Burger menu button */
  menuButton: '#react-burger-menu-btn',

  /** Logout link inside the burger menu */
  logoutLink: '#logout_sidebar_link',

  /**
   * "Add to cart" button for a specific product.
   * The data-test attribute follows the pattern: add-to-cart-<slug>
   * e.g. "Sauce Labs Backpack" → "add-to-cart-sauce-labs-backpack"
   *
   * @param productName - The exact product name as shown in the UI.
   * @returns A CSS attribute selector string.
   */
  addToCartButton: (productName: string): string => {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `[data-test="add-to-cart-${slug}"]`;
  },

  /**
   * "Remove" button for a specific product (shown after adding to cart).
   * The data-test attribute follows the pattern: remove-<slug>
   * e.g. "Sauce Labs Backpack" → "remove-sauce-labs-backpack"
   *
   * @param productName - The exact product name as shown in the UI.
   * @returns A CSS attribute selector string.
   */
  removeButton: (productName: string): string => {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `[data-test="remove-${slug}"]`;
  },
};
