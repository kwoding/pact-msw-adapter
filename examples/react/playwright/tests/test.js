import { test as base, expect } from '@playwright/test';
import { setupPactMswAdapter } from '@pactflow/pact-msw-adapter';

const test = base.extend({
  page: async ({ page }, use) => {
    await page.exposeFunction("setupPactAdapter", setupPactMswAdapter);
    await page.goto('http://localhost:3000');

    const pactMswAdapter = await page.evaluate(async () => {
      const { msw } = window;

      return await setupPactAdapter({
        worker: msw.worker,
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
    });

    console.log('pactMswAdapter', pactMswAdapter);

    pactMswAdapter.newTest();
    use(page);
    // Cleanup after test
    pactMswAdapter.verifyTest();
    await pactMswAdapter.writeToFile();
    pactMswAdapter.clear();
  }
});

export { test, expect };
