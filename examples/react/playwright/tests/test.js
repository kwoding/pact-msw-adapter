import { test as base, expect } from '@playwright/test';
import { setupPactMswAdapter } from '@pactflow/pact-msw-adapter';

const test = base.extend({
  worker: async ({ page }, use) => {
    await page.goto('http://localhost:3000');

    const worker = await page.evaluate('window.msw.worker');

    const pactMswAdapter = setupPactMswAdapter({
      worker,
      options: {
        consumer: 'testConsumer',
        timeout: 1000,
        providers: {
          ['testProvider']: ['/products'],
          ['testProvider2']: ['/product/09']
        },
        // pactOutDir: './pacts',
        // excludeUrl: ['static/'],
        includeUrl: ['/products', '/product/09'],
        excludeHeaders: ['ignore-me']
        // debug: true
      }
    });

    pactMswAdapter.newTest();
    use(page);
    // Cleanup after test
    pactMswAdapter.verifyTest();
    worker.resetHandlers();
    await pactMswAdapter.writeToFile();
    pactMswAdapter.clear();
  }
});

export { test, expect };
