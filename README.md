# PlaywrightDemo

End-to-end test suite built with Playwright, covering the Playwright.dev homepage and the TodoMVC demo app across Chromium, Firefox, and WebKit.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)

## Install

```bash
npm install
npx playwright install
```

## Run Tests

**Headless** (default — no browser window):
```bash
npx playwright test
```

**Headed** (browser window visible):
```bash
npx playwright test --headed
```

**Single browser:**
```bash
npx playwright test --project=chromium
```

**Specific test file:**
```bash
npx playwright test tests/todo.spec.js
```

## View HTML Report

After a test run, open the report in your browser:
```bash
npx playwright show-report
```

The report is saved to `playwright-report/` and includes pass/fail status, execution time, and error traces.

## Project Structure

```
tests/
  example.spec.js   # Playwright.dev homepage tests
  todo.spec.js      # TodoMVC add / edit / complete tests
playwright.config.js
```

## Tech Stack

Playwright 1.59 · Node.js 18+ · Chromium · Firefox · WebKit · GitHub Actions
