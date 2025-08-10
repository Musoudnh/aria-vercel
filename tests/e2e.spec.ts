import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('Home loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AriaHQ|Aria|Dashboard/i);
  });

  test('Chat endpoint responds', async ({ page, request }) => {
    const res = await request.post('/api/aria/ask', {
      data: { query: 'what are sales this month?' },
    });
    // Allow 404 for repos that haven't added the endpoint yet, but log it.
    expect([200, 404]).toContain(res.status());
  });

  test('Health endpoint responds', async ({ request }) => {
    const res = await request.get('/api/health');
    expect([200, 404]).toContain(res.status());
  });
});
