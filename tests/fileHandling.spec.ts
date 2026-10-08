/**
 * fileHandling.spec.ts
 * Example tests demonstrating how to use upload files and handle downloads.
 *
 * NOTE: saucedemo.com does not have a real file-upload or download feature.
 * These tests show the PATTERN using a generic file-input element and a
 * simulated download link. Replace the selectors with real ones when your
 * app has these features.
 *
 * Tags: @regression
 */

import { test, expect } from '../src/fixtures/baseFixture';
import { getUploadFilePath, saveDownload } from '../src/utils/fileUtils';
import * as fs from 'fs';
import * as path from 'path';

test.describe('File Handling (pattern examples)', () => {

  // ── Upload example ─────────────────────────────────────────────────────────

  test.skip('should resolve the upload file path correctly @regression', async () => {
    // Verify the helper returns a valid path to the sample file
    const filePath = getUploadFilePath('sample.txt');
    expect(fs.existsSync(filePath)).toBe(true);
    expect(path.extname(filePath)).toBe('.txt');
  });

  /**
   * Pattern: how to set a file on an <input type="file"> element.
   *
   * In a real test replace '#file-input' with the actual selector.
   * This test is skipped because saucedemo has no file input.
   */
  test.skip('should upload a file via an input element (pattern) @regression', async ({ page }) => {
    const filePath = getUploadFilePath('sample.txt');

    // setInputFiles attaches the file without opening the OS dialog
    await page.setInputFiles('#file-input', filePath);

    // Assert the file name appears somewhere in the UI after upload
    await expect(page.locator('#uploaded-file-name')).toContainText('sample.txt');
  });

  // ── Download example ───────────────────────────────────────────────────────

  /**
   * Pattern: how to capture a file download triggered by a button click.
   *
   * In a real test replace '#download-btn' with the actual selector.
   * This test is skipped because saucedemo has no download link.
   */
  test.skip('should download a file and save it locally (pattern) @regression', async ({ page }) => {
    // Wait for the download event that the button click triggers
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#download-btn'),
    ]);

    // Save the file to src/resources/downloads/
    const savedPath = await saveDownload(download, 'downloaded-report.pdf');

    // Verify the file was actually written to disk
    expect(fs.existsSync(savedPath)).toBe(true);
  });
});
