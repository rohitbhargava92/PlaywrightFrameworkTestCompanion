# Saucedemo Playwright Framework

A clean, industry-standard **Playwright + TypeScript** test automation framework for [saucedemo.com](https://www.saucedemo.com), built with the **Page Object Model (POM)**. A new team member should be able to understand the whole framework in under 30 minutes.

---

## Table of Contents

1. [Prerequisites & Setup](#prerequisites--setup)
2. [Running Tests](#running-tests)
3. [Folder Structure Explained](#folder-structure-explained)
4. [How the Pieces Connect](#how-the-pieces-connect)
5. [How to Add a New Page and a New Test](#how-to-add-a-new-page-and-a-new-test)
6. [CI/CD with GitHub Actions](#cicd-with-github-actions)

---

## Prerequisites & Setup

**Requirements**

- Node.js 20 LTS — [download](https://nodejs.org/)
- npm (bundled with Node)

**First-time setup**

```bash
# 1. Install project dependencies
npm install

# 2. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 3. Copy the environment template and fill in the values
cp .env.example .env
```

Open `.env` and confirm the values:

```
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
PASSWORD=secret_sauce
```

---

## Running Tests

| Command | What it does |
|---|---|
| `npm test` | Run the full suite on all three browsers |
| `npm run test:smoke` | Run only `@smoke`-tagged tests |
| `npm run test:headed` | Run with a visible browser window |
| `npm run test:ui` | Open the Playwright UI (interactive mode) |
| `npm run test:chromium` | Run on Chromium only |
| `npm run report` | Open the last HTML report in your browser |

---

## Folder Structure Explained

```
├── .github/workflows/      # GitHub Actions CI workflow
├── src/
│   ├── locators/           # Selector strings — one file per page
│   ├── pages/              # Page classes — actions only, no selectors
│   ├── fixtures/           # Custom Playwright fixtures (page object wiring)
│   ├── global/             # global-setup.ts and global-teardown.ts
│   ├── resources/
│   │   ├── testData/       # JSON files: users, products, checkout data
│   │   ├── uploads/        # Sample files for upload tests
│   │   └── downloads/      # Target folder for downloaded files (gitignored)
│   └── utils/              # Reusable helpers: logger, env, fileUtils, dataUtils
├── tests/                  # Spec files — one file per feature
├── .env.example            # Environment variable template
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Scripts and dependencies
```

### What each folder does

| Folder | Purpose |
|---|---|
| `src/locators/` | Plain objects of CSS/attribute selector strings. **Nothing else.** |
| `src/pages/` | Page classes with action methods. They import selectors from `locators/` and use `page.*` to interact with the browser. No assertions here. |
| `src/fixtures/` | Wires page objects into Playwright's `test` function so specs receive them as arguments. |
| `src/global/` | One-time setup (validate env, create folders) and teardown (clean downloads). |
| `src/utils/` | Shared helpers: structured logger, typed env accessors, file I/O, data generators. |
| `src/resources/` | Static test data (JSON), upload files, and the downloads target folder. |
| `tests/` | Spec files. Each file covers one feature. Tests import from `baseFixture.ts`. |

---

## How the Pieces Connect

```
Test spec (tests/*.spec.ts)
  └── imports test & expect from src/fixtures/baseFixture.ts
        └── fixture creates page objects, e.g. new LoginPage(page)
              └── LoginPage (src/pages/LoginPage.ts)
                    └── imports selectors from src/locators/loginPageLocators.ts
                          └── uses page.fill('#user-name', ...)
```

**Reading it top-down:**

1. A **spec** describes *what* to test using plain English test names.
2. A **fixture** provides ready-made page objects — the spec never calls `new`.
3. A **page class** provides *how* to interact with a page (actions/methods).
4. A **locator file** holds *where* the elements are (selector strings).

This separation means:
- When a selector changes → update only the locator file.
- When a flow changes → update only the page class.
- Tests stay readable and stable.

---

## How to Add a New Page and a New Test

### Step 1 — Add a locator file

Create `src/locators/myPageLocators.ts`:

```typescript
export const myPageLocators = {
  heading: '[data-test="my-heading"]',
  submitButton: '[data-test="submit"]',
};
```

### Step 2 — Add a page class

Create `src/pages/MyPage.ts`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { myPageLocators } from '../locators/myPageLocators';
import { logger } from '../utils/logger';

export class MyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Clicks the submit button. */
  async submit(): Promise<void> {
    logger.step('Clicking submit');
    await this.page.click(myPageLocators.submitButton);
  }
}
```

### Step 3 — Register the fixture

Open `src/fixtures/baseFixture.ts` and add:

```typescript
// In the PageFixtures type:
myPage: MyPage;

// In the test.extend block:
myPage: async ({ page }, use) => {
  await use(new MyPage(page));
},
```

### Step 4 — Write the spec

Create `tests/myFeature.spec.ts`:

```typescript
import { test, expect } from '../src/fixtures/baseFixture';
import { myPageLocators } from '../src/locators/myPageLocators';

test.describe('My Feature', () => {
  test('should do something @smoke', async ({ myPage, page }) => {
    await myPage.submit();
    await expect(page.locator(myPageLocators.heading)).toBeVisible();
  });
});
```

That's it — four files, no boilerplate beyond what you see above.

---

## CI/CD with GitHub Actions

### What the workflow does

The workflow file is at `.github/workflows/playwright.yml`. On every push or pull request to `main` it:

1. Checks out the code.
2. Sets up Node 20 with npm caching.
3. Runs `npm ci` to install dependencies.
4. Installs Playwright browsers with OS dependencies.
5. Runs the full test suite (`npx playwright test`).
6. Uploads the **HTML report** as an artifact (always, 14-day retention).
7. Uploads **screenshots / videos / traces** as an artifact (only on failure).

### Required repository variables and secrets

Go to **Settings → Secrets and variables → Actions** in your GitHub repository and add:

| Name | Kind | Example value |
|---|---|---|
| `BASE_URL` | Variable (`vars.*`) | `https://www.saucedemo.com` |
| `STANDARD_USER` | Variable (`vars.*`) | `standard_user` |
| `LOCKED_OUT_USER` | Variable (`vars.*`) | `locked_out_user` |
| `PASSWORD` | **Secret** (`secrets.*`) | `secret_sauce` |

### How to run the workflow manually

1. Go to the **Actions** tab in your GitHub repository.
2. Click **"Playwright Tests"** in the left sidebar.
3. Click **"Run workflow"** → choose the branch → click the green **"Run workflow"** button.

### Downloading the report

After a workflow run completes:

1. Click the run in the **Actions** tab.
2. Scroll to the **Artifacts** section at the bottom.
3. Download **`playwright-report`** and open `index.html` in your browser.

> **Tip:** To add sharding (parallel machines) when the suite grows, see the comment in `playwright.yml` — it's a one-line matrix change.
