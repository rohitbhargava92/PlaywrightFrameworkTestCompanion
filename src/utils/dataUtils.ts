/**
 * dataUtils.ts
 * Helpers for generating and transforming test data at runtime.
 */

import { logger } from './logger';

/**
 * Parses a price string like "$9.99" into a float.
 *
 * @param priceText - The raw price string from the UI.
 * @returns The numeric price value.
 */
export function parsePrice(priceText: string): number {
  const value = parseFloat(priceText.replace('$', '').trim());
  if (isNaN(value)) {
    throw new Error(`Could not parse price from: "${priceText}"`);
  }
  return value;
}

/**
 * Generates a random checkout data object for use in checkout form tests.
 * Uses a timestamp suffix to keep values unique across parallel runs.
 *
 * @returns An object with firstName, lastName, and postalCode.
 */
export function randomCheckoutData(): { firstName: string; lastName: string; postalCode: string } {
  const suffix = Date.now().toString().slice(-4);
  const data = {
    firstName: `Test${suffix}`,
    lastName: `User${suffix}`,
    postalCode: `1000${suffix}`,
  };
  logger.info(`Generated checkout data: ${JSON.stringify(data)}`);
  return data;
}

/**
 * Sorts an array of price strings in ascending order and returns the sorted floats.
 *
 * @param prices - Array of price strings, e.g. ["$9.99", "$4.99"]
 * @returns Sorted array of numeric prices (low to high).
 */
export function sortPricesAscending(prices: string[]): number[] {
  return prices.map(parsePrice).sort((a, b) => a - b);
}

/**
 * Sorts an array of price strings in descending order and returns the sorted floats.
 *
 * @param prices - Array of price strings, e.g. ["$9.99", "$4.99"]
 * @returns Sorted array of numeric prices (high to low).
 */
export function sortPricesDescending(prices: string[]): number[] {
  return prices.map(parsePrice).sort((a, b) => b - a);
}
