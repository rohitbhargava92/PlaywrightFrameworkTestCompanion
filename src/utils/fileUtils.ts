/**
 * fileUtils.ts
 * Helpers for file system operations used in tests:
 *  - resolving upload file paths
 *  - saving downloaded files
 *  - reading JSON test-data files
 */

import fs from 'fs';
import path from 'path';
import { Download } from '@playwright/test';
import { logger } from './logger';

// Absolute paths to the resource folders so helpers work regardless of cwd
const UPLOADS_DIR = path.resolve(__dirname, '../resources/uploads');
const DOWNLOADS_DIR = path.resolve(__dirname, '../resources/downloads');
const TEST_DATA_DIR = path.resolve(__dirname, '../resources/testData');

/**
 * Returns the absolute path to a file in the uploads folder.
 *
 * @param fileName - File name, e.g. "sample.txt"
 * @returns Absolute path string.
 */
export function getUploadFilePath(fileName: string): string {
  const filePath = path.join(UPLOADS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Upload file not found: ${filePath}`);
  }
  logger.info(`Resolved upload path: ${filePath}`);
  return filePath;
}

/**
 * Saves a Playwright Download to the downloads folder.
 *
 * @param download - The Playwright Download object from the page event.
 * @param fileName - The name to save the file as.
 * @returns The absolute path where the file was saved.
 */
export async function saveDownload(download: Download, fileName: string): Promise<string> {
  const savePath = path.join(DOWNLOADS_DIR, fileName);
  await download.saveAs(savePath);
  logger.info(`File downloaded and saved to: ${savePath}`);
  return savePath;
}

/**
 * Reads and parses a JSON test-data file from src/resources/testData/.
 *
 * @param fileName - File name, e.g. "users.json"
 * @returns Parsed JSON as the given generic type T.
 */
export function readTestData<T>(fileName: string): T {
  const filePath = path.join(TEST_DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  logger.info(`Loaded test data from: ${filePath}`);
  return JSON.parse(raw) as T;
}

/**
 * Ensures a directory exists, creating it (and any parents) if needed.
 *
 * @param dirPath - Absolute path to the directory.
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
}

/**
 * Removes all files inside a directory without deleting the directory itself.
 *
 * @param dirPath - Absolute path to the directory to clean.
 */
export function cleanDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) return;
  for (const file of fs.readdirSync(dirPath)) {
    // Skip .gitkeep so the folder stays tracked in git
    if (file === '.gitkeep') continue;
    fs.rmSync(path.join(dirPath, file), { recursive: true, force: true });
  }
  logger.info(`Cleaned directory: ${dirPath}`);
}
