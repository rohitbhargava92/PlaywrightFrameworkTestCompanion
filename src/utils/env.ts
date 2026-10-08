/**
 * env.ts
 * Typed accessors for environment variables.
 * All values are read once at import time so tests get a consistent view.
 * Throws at startup if a required variable is missing.
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * Returns the value of an environment variable.
 * Throws if the variable is not set, so misconfiguration fails fast.
 *
 * @param name - The environment variable name.
 * @returns The string value.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable "${name}" is not set. Check your .env file.`);
  }
  return value;
}

export const env = {
  /** Base URL of the application under test. */
  baseUrl: requireEnv('BASE_URL'),

  /** Username for the standard (happy-path) test user. */
  standardUser: requireEnv('STANDARD_USER'),

  /** Username for the locked-out test user. */
  lockedOutUser: requireEnv('LOCKED_OUT_USER'),

  /** Shared password for all test users. */
  password: requireEnv('PASSWORD'),
};
