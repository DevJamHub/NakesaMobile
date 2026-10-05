// Loaded with `node --import` before the tests (see the "test" script in package.json).
import * as nodeModule from 'node:module';

import { resolve } from './hooks.mjs';

// React Native's global; the app logs extra details while it is true.
globalThis.__DEV__ = false;

if (typeof nodeModule.registerHooks === 'function') {
  nodeModule.registerHooks({ resolve }); // Node ≥ 22.15: synchronous hooks on this thread
} else {
  nodeModule.register('./hooks.mjs', import.meta.url);
}
