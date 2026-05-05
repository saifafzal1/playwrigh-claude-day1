// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Runs a setup hook automatically before every test in this file.
 * It checks the current browser type and initializes instrumentation on Chromium to track JavaScript execution.
 */
test.beforeEach(async ({ page, browserName }) => {
  if (browserName === 'chromium') {
    await page.coverage.startJSCoverage();
  }
});

/**
 * Takes an array of {start, end} numeric ranges and collapses any that overlap or are adjacent into a single range.
 * Returns a new sorted array of non-overlapping ranges that together span the same total area as the input.
 */
function mergeRanges(ranges) {
  if (!ranges.length) return [];
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i].start <= last.end) last.end = Math.max(last.end, sorted[i].end);
    else merged.push({ ...sorted[i] });
  }
  return merged;
}

/**
 * Runs a teardown hook automatically after every test in this file.
 * It collects JavaScript execution metrics for Chromium, calculates a usage percentage, and logs the result in a structured format.
 */
test.afterEach(async ({ page, browserName }, testInfo) => {
  if (browserName === 'chromium') {
    const coverage = await page.coverage.stopJSCoverage();
    let totalBytes = 0, usedBytes = 0;
    for (const entry of coverage) {
      const srcLen = entry.source?.length ?? 0;
      totalBytes += srcLen;
      const executed = entry.functions.flatMap(fn =>
        fn.ranges.filter(r => r.count > 0).map(r => ({ start: r.startOffset, end: r.endOffset }))
      );
      usedBytes += mergeRanges(executed).reduce((acc, r) => acc + r.end - r.start, 0);
    }
    const pct = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(2) : '0.00';
    console.log(`COVERAGE::${testInfo.title}::${pct}::${usedBytes}::${totalBytes}`);
  }
});

/**
 * Verifies that the Playwright homepage loads successfully and has the correct title.
 * It navigates to playwright.dev and asserts the page title contains the word "Playwright".
 */
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

/**
 * Verifies that clicking the "Get started" link on the homepage navigates to the correct page.
 * It asserts that the "Installation" heading is visible after the click, confirming the link works.
 */
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
