import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

// Every route file must be import-able and mountable without Express
// throwing. This directly guards against the bug where chained
// .put()/.get() calls were passed string literals instead of middleware
// functions (e.g. router.route('/:id').put(mw, ':id/accept', handler)),
// which throws synchronously as soon as the router is built.
const routeModules = [
  '../routes/userRoutes.js',
  '../routes/lspRoutes.js',
  '../routes/bookingRoutes.js',
  '../routes/serviceCatalogRoutes.js',
  '../routes/locationRoutes.js',
  '../routes/notificationRoutes.js',
  '../routes/reviewRoutes.js',
  '../routes/uploadRoutes.js',
  '../routes/adminRoutes.js',
];

for (const modulePath of routeModules) {
  test(`${modulePath} mounts without throwing`, async () => {
    const { default: router } = await import(modulePath);
    const app = express();
    assert.doesNotThrow(() => app.use('/test', router));
  });
}
