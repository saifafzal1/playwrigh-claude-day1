import { test, expect } from '@playwright/test';

/**
 * Verifies that multiple todo items can be added to the list one after another.
 * Asserts the total item count, visibility of each item, and that the list renders correctly.
 */
test('adds multiple todo items', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const newTodo = page.getByPlaceholder('What needs to be done?');

  await newTodo.fill('Playwright exercises needs to be completed');
  await newTodo.press('Enter');
  await newTodo.fill('Claude prompt exercise needs to be completed.');
  await newTodo.press('Enter');
  await newTodo.fill('Claude reactor exercise needs to be completed.');
  await newTodo.press('Enter');

  await expect(page.getByLabel('Toggle Todo')).toHaveCount(3);
  await expect(page.getByText('Playwright exercises needs to be completed')).toBeVisible();
  await expect(page.getByText('Claude reactor exercise needs to be completed.')).toBeVisible();
});

/**
 * Verifies that double-clicking a todo item opens it for editing and saves the corrected text.
 * Asserts the corrected text is visible, the old typo text is gone, and the item count stays the same.
 */
test('edits a todo item to fix a typo', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const newTodo = page.getByPlaceholder('What needs to be done?');
  await newTodo.fill('Claude promt exercise needs to be completed.');
  await newTodo.press('Enter');

  await page.getByText('Claude promt exercise needs to be completed.').dblclick();
  await page.getByRole('textbox', { name: 'Edit' }).fill('Claude prompt exercise needs to be completed.');
  await page.getByRole('textbox', { name: 'Edit' }).press('Enter');

  await expect(page.getByText('Claude prompt exercise needs to be completed.')).toBeVisible();
  await expect(page.getByText('Claude promt exercise')).not.toBeVisible();
  await expect(page.getByLabel('Toggle Todo')).toHaveCount(1);
});

/**
 * Verifies that toggling a todo item marks it as completed in the UI.
 * Asserts the checkbox is checked, the item receives the completed style, and the Completed filter link appears.
 */
test('marks a todo item as complete', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const newTodo = page.getByPlaceholder('What needs to be done?');
  await newTodo.fill('Playwright exercises needs to be completed');
  await newTodo.press('Enter');

  const todoItem = page.getByRole('listitem').filter({ hasText: 'Playwright exercises needs to be completed' });
  await todoItem.getByLabel('Toggle Todo').check();

  await expect(todoItem.getByLabel('Toggle Todo')).toBeChecked();
  await expect(todoItem).toHaveClass(/completed/);
  await expect(page.getByRole('link', { name: 'Completed' })).toBeVisible();
});
