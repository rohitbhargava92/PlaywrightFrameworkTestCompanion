/**
 * global-setup.ts
 * Runs ONCE before the entire test suite.
 * Responsibilities:
 *  1. Log that the run is starting.
 *  2. Validate that all required .env variables are present.
 *  3. Ensure the downloads folder exists so tests can write to it.
 */

import path from 'path';
import { logger } from '../utils/logger';
import { ensureDir } from '../utils/fileUtils';

// Required environment variable names
const REQUIRED_ENV_VARS = ['BASE_URL', 'STANDARD_USER', 'LOCKED_OUT_USER', 'PASSWORD'];

async function globalSetup(): Promise<void> {
  // Step 1: Log run start
  logger.step('=== Test run starting ===');

  // Step 2: Validate required environment variables
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill in the values.'
    );
  }
  logger.info(`Environment validated. BASE_URL=${process.env['BASE_URL']}`);

  // Step 3: Ensure the downloads folder exists
  const downloadsDir = path.resolve(__dirname, '../resources/downloads');
  ensureDir(downloadsDir);
  logger.info('Downloads folder is ready.');
}

export default globalSetup;
