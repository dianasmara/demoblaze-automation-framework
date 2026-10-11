# 🎭 DemoBlaze E2E Test Automation Framework

> **Playwright + TypeScript** | Cross-browser | CI/CD Ready | Multi-layer Testing

[![Playwright](https://img.shields.io/badge/Playwright-1.48-45ba4b?logo=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs)](https://nodejs.org)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088ff?logo=githubactions)](https://github.com/features/actions)

---

##  Table of Contents

- [Overview](#overview)
- [Framework Architecture](#framework-architecture)
- [Directory Structure](#directory-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [CI/CD Pipeline](#cicd-pipeline)
- [Reporting](#reporting)
- [Design Decisions](#design-decisions)

---

## Overview

This framework provides comprehensive automated testing for [DemoBlaze](https://www.demoblaze.com), covering:

| Layer | Tool | Coverage |
|-------|------|----------|
| **UI / E2E** | Playwright | Login, Cart, Order flows |
| **API** | Playwright APIRequestContext | REST endpoints, schema, security |
| **Performance** | Web Performance API | Core Web Vitals, load times |
| **Regression** | Playwright | Critical path sanity suite |
| **Cross-browser** | Playwright | Chrome, Firefox, Safari, Mobile |

---

## Framework Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Test Orchestration                        │
│              playwright.config.ts + GitHub Actions           │
└──────────────────────┬───────────────────────────────────────┘
                       │
         ┌─────────────▼─────────────┐
         │       Test Fixtures        │
         │   base.fixture.ts          │
         │   auth.setup.ts            │
         └─────────────┬─────────────┘
                       │
    ┌──────────────────▼──────────────────────┐
    │           Page Object Models             │
    │  BasePage → LoginPage, HomePage,         │
    │             ProductPage, CartPage        │
    └──────────────────┬──────────────────────┘
                       │
    ┌──────────────────▼──────────────────────┐
    │            Test Suites                   │
    │  ui/ │ api/ │ regression/ │ performance/ │
    └──────────────────┬──────────────────────┘
                       │
    ┌──────────────────▼──────────────────────┐
    │          Utilities & Data                │
    │  helpers.ts │ testData.ts │ types/       │
    └─────────────────────────────────────────┘
```

### Key Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Page Object Model** | Separates UI structure from test logic |
| **Single Responsibility** | One POM per page, one concern per test |
| **DRY** | Shared fixtures, data constants, base class |
| **Fail Fast** | Regression suite runs first in CI pipeline |
| **Resilient** | Explicit waits over sleep, retry on flakiness |
| **Type Safe** | Strict TypeScript across all layers |

---

## Directory Structure

```
demoblaze-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD — 8-job parallel pipeline
├── src/
│   ├── fixtures/
│   │   ├── auth.setup.ts           # Shared auth state (login once)
│   │   └── base.fixture.ts         # Extended test object with POMs
│   ├── pages/
│   │   ├── BasePage.ts             # Abstract base with shared methods
│   │   ├── LoginPage.ts            # Login modal POM
│   │   ├── HomePage.ts             # Home/product listing POM
│   │   ├── ProductPage.ts          # Product detail POM
│   │   └── CartPage.ts             # Cart + order modal POM
│   ├── tests/
│   │   ├── ui/
│   │   │   ├── login.spec.ts       # 55 login test cases
│   │   │   └── cart.spec.ts        # 60+ cart test cases
│   │   ├── api/
│   │   │   └── demoblaze-api.spec.ts  # API layer tests
│   │   ├── performance/
│   │   │   └── performance.spec.ts    # Core Web Vitals tests
│   │   └── regression/
│   │       └── regression.spec.ts     # Critical path regression
│   ├── types/
│   │   └── index.ts                # Shared TypeScript interfaces
│   └── utils/
│       ├── helpers.ts              # Shared test utilities
│       └── testData.ts             # Centralized test data
├── config/                         # Environment-specific configs
├── .env.example                    # Environment variables template
├── playwright.config.ts            # Main Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
└── README.md
```

---

## Tech Stack

| Tool | Version | Role |
|------|---------|------|
| **Playwright** | ^1.48 | E2E, API, performance testing |
| **TypeScript** | ^5.6 | Type-safe test scripts |
| **Node.js** | 20+ | Runtime |
| **Allure** | ^3.0 | Rich test reporting |
| **GitHub Actions** | - | CI/CD orchestration |
| **ESLint** | ^9 | Code quality |

---

## Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 9.x
- **Git**
- A DemoBlaze account (register at https://www.demoblaze.com)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/demoblaze-e2e-framework.git
cd demoblaze-e2e-framework
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
VALID_USERNAME=your_demoblaze_username
VALID_PASSWORD=your_demoblaze_password
```

> 💡 Register a new account at https://www.demoblaze.com → Sign up

### 5. Run the Demo Tests

```bash
# Run the full regression + login + cart flows
npm run test:regression

# Or run everything
npm test
```

---

## Configuration

### Environment Variables (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://www.demoblaze.com` | Application under test |
| `VALID_USERNAME` | `admin` | Valid test account username |
| `VALID_PASSWORD` | `admin` | Valid test account password |
| `HEADLESS` | `true` | Run browser headless |
| `DEFAULT_TIMEOUT` | `60000` | Test timeout (ms) |

### Browser Configuration (`playwright.config.ts`)

The framework runs against **6 browser/device profiles** out of the box:

| Project | Browser | Type |
|---------|---------|------|
| `chromium` | Chrome (latest) | Desktop |
| `firefox` | Firefox (latest) | Desktop |
| `webkit` | Safari (latest) | Desktop |
| `Mobile Chrome` | Pixel 5 emulation | Mobile |
| `Mobile Safari` | iPhone 14 emulation | Mobile |
| `iPad` | iPad Pro emulation | Tablet |

---

## Running Tests

### Demo Scripts (Quick Start)

```bash
# Login flow demo
npx playwright test tests/ui/login.spec.ts --project=chromium --headed

# Cart + order flow demo
npx playwright test tests/ui/cart.spec.ts --project=chromium --headed

# Full regression (all critical paths)
npm run test:regression
```

### By Test Suite

```bash
# UI Tests only
npm run test:ui

# API Tests only
npm run test:api

# Performance Tests only
npm run test:performance

# Regression Suite only
npm run test:regression
```

### By Browser

```bash
npm run test:chrome     # Chrome only
npm run test:firefox    # Firefox only
npm run test:webkit     # Safari only
npm run test:mobile     # Mobile Chrome
```

### Run Specific Test File

```bash
npx playwright test src/tests/ui/login.spec.ts
```

### Run Specific Test by Name

```bash
npx playwright test --grep "TC-LOGIN-011"
```

### Run with UI Mode (Debug)

```bash
npx playwright test --ui
```

### Run Headed (See Browser)

```bash
npm run test:headed
```

### Debug a Single Test

```bash
PWDEBUG=1 npx playwright test --grep "TC-CART-E2E-001" --project=chromium
```

---

## Test Suites

### 🔐 Login Tests (`src/tests/ui/login.spec.ts`)

| Group | Count | Description |
|-------|-------|-------------|
| Modal Behavior | 6 | Open, close, field validation |
| Positive Scenarios | 7 | Successful login, logout, re-login |
| Negative Scenarios | 8 | Wrong creds, empty fields, case sensitivity |
| Security & Edge Cases | 6 | XSS, SQLi, long inputs, unicode |
| Accessibility | 2 | Keyboard navigation, Enter to submit |
| **Total** | **55+** | |

### 🛒 Cart Tests (`src/tests/ui/cart.spec.ts`)

| Group | Count | Description |
|-------|-------|-------------|
| Add to Cart | 7 | Single/multiple items, price validation |
| View & Manage Cart | 6 | Display, delete, persistence |
| Order — Happy Path | 8 | Modal, form, confirmation |
| Order — Negative | 6 | Empty fields, empty cart, XSS |
| E2E Flow | 1 | Full login → browse → cart → checkout |
| **Total** | **60+** | |

### 🔌 API Tests (`src/tests/api/demoblaze-api.spec.ts`)

| Group | Count | Description |
|-------|-------|-------------|
| POST /login | 5 | Auth, error handling, security |
| POST /entries | 3 | Product listing, schema |
| POST /view | 2 | Product detail |
| Cart API | 2 | Add, view cart |
| POST /placeorder | 2 | Order placement |
| Schema / Contract | 3 | Response structure, security headers |

### ⚡ Performance Tests (`src/tests/performance/performance.spec.ts`)

Tests against defined thresholds:

| Metric | Threshold |
|--------|-----------|
| TTFB | < 800ms |
| FCP | < 2000ms |
| LCP | < 3000ms |
| DOM Load | < 3000ms |
| Full Load | < 5000ms |

### 🔁 Regression Suite (`src/tests/regression/regression.spec.ts`)

10 critical-path tests that run on every PR and deployment, covering the most business-critical user journeys.

---

## CI/CD Pipeline

### GitHub Actions — 8-Job Parallel Pipeline

```
[install] → [lint]
                ↓
         [regression] (Chrome + Firefox, fast gate)
                ↓
    ┌─────────────────────────────┐
    │ [ui-tests] (3 browsers)     │
    │ [api-tests]                 │
    │ [performance-tests]         │
    │ [mobile-tests]              │
    └─────────────────────────────┘
                ↓
         [publish-report]
```

### GitHub Secrets Required

| Secret | Value |
|--------|-------|
| `VALID_USERNAME` | Your DemoBlaze username |
| `VALID_PASSWORD` | Your DemoBlaze password |

### Triggers

- **Push** to `main` or `develop`
- **Pull Request** targeting `main` or `develop`
- **Scheduled**: Nightly at 02:00 WIB
- **Manual**: `workflow_dispatch` with suite/browser selection

---

## Reporting

### HTML Report (default)

```bash
npm test
npm run report    # Opens at http://localhost:9323
```

### Allure Report (rich analytics)

```bash
npm test
npm run report:allure
```

### JSON / JUnit

Automatically generated at:
- `test-results/results.json`
- `test-results/junit.xml`

---

## Design Decisions

### Why Playwright over Cypress/Selenium?

| Factor | Decision |
|--------|----------|
| **Multi-browser** | Playwright natively supports Chrome, Firefox, Safari |
| **Network interception** | Built-in, no plugins needed |
| **API testing** | `APIRequestContext` built-in |
| **Performance** | `addInitScript` + Performance API |
| **TypeScript** | First-class support, strict mode |
| **Parallel** | Native, per-file by default |
| **Auto-wait** | Eliminates most flakiness |

### Why Page Object Model?

- Tests read like documentation
- UI changes require updates in one place only
- Composable — fixtures combine POMs naturally

### Why Shared Auth State?

`auth.setup.ts` logs in once and saves browser storage state. All subsequent tests in the same project **reuse** that state — no repeated login calls, faster test runs.

---

##  Test Case Documentation

See the accompanying Google Sheet / Excel for the full test case matrix:
- **Login Module**: 55 test cases
- **Cart Module**: 60+ test cases
- Format: TC-ID, Title, Preconditions, Steps, Expected Result, Priority, Status

---

##  Contributing

1. Branch from `develop`
2. Write tests following POM pattern
3. Run `npm run type-check` before committing
4. PR description must include TC-IDs covered

---

*Built with ❤️ for the QA Automation Challenge*

<!-- 
NOTE: FOR CROSS PLATFORM BROWSER CAN CHANGE IN "playwright.config.js"
 -->