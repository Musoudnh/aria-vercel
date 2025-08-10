# Autonomous CI/CD Starter for AriaHQ

This drop-in repo scaffolding gives you:
- GitHub Actions CI (build + tests)
- Nightly E2E tests (Playwright) against STAGING_URL
- Deploy hooks for Vercel (UI) and Render/Railway (API)
- PR & Issue templates
- Codeowners + branch protection suggestions

## Quick Start

1) **Add these files** to your repo root (keep folders as-is).
2) In GitHub → **Settings → Secrets and variables → Actions → New repository secret**. Add:
   - `STAGING_URL` — your staging site base URL (e.g., https://aria-vercel.vercel.app)
   - `PLAYWRIGHT_BROWSERS` — set to `1` (enables browser install in CI)
   - Optional deploy hooks (if you have them):
     - `VERCEL_DEPLOY_HOOK` — URL from Vercel → Project → Deploy Hooks (staging)
     - `RENDER_DEPLOY_HOOK` or `RAILWAY_DEPLOY_HOOK` — webhook URL if available
   - Optional integration keys (test credentials):
     - `SLACK_WEBHOOK_URL`, `SENDGRID_API_KEY`, `STRIPE_SECRET_KEY`

3) **Push to `main`**. CI will run:
   - Lint/basic checks
   - Playwright E2E (skips if `STAGING_URL` not set)
   - On success, calls your deploy hook(s) if configured

4) **Nightly E2E** runs at 3:15 AM UTC and opens issues automatically on failures.

---

## Local E2E test
```
npm ci
npx playwright install --with-deps
STAGING_URL=http://localhost:5173 npx playwright test
```
(Host your app locally however you prefer.)

---

## Branch protection (recommended)
- Require PRs to `main`
- Require status checks to pass: `ci` workflow
- Require 1 approving review
- Dismiss stale approvals on new commits

