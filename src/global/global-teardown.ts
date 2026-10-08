/**
 * global-teardown.ts
 * Runs ONCE after the entire test suite completes.
 * Responsibilities:
 *  1. Clean up files in the downloads folder (keeps .gitkeep).
 *  2. Log that the run has ended.
 */

import path from 'path';
import { logger } from '../utils/logger';
import { cleanDir } from '../utils/fileUtils';

async function globalTeardown(): Promise<void> {
  // Step 1: Clean up downloaded files from this run
  const downloadsDir = path.resolve(__dirname, '../resources/downloads');
  cleanDir(downloadsDir);
  logger.info('Downloads folder cleaned up.');

  // Step 2: Log run end
  logger.step('=== Test run complete ===');
}

export default globalTeardown;
