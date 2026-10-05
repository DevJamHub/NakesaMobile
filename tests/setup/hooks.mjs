// Module resolution for running the app's pure TypeScript modules in Node: "@/…" imports
// (tsconfig paths) and extensionless imports inside src/ are pointed at the .ts files.
// Node strips the types itself (Node ≥ 22.18), so no build step or extra package is needed.
import { existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

const SRC = new URL('../../src/', import.meta.url).href;

function sourceFile(base) {
  for (const suffix of ['.ts', '/index.ts']) {
    if (existsSync(fileURLToPath(base + suffix))) return base + suffix;
  }
  return null;
}

// The app's .ts files are ES modules; saying so spares Node from guessing (and warning).
const asModule = (result) =>
  result.url.startsWith(SRC) && result.url.endsWith('.ts') ? { ...result, format: 'module-typescript' } : result;

export function resolve(specifier, context, nextResolve) {
  let target = specifier;
  if (specifier.startsWith('@/')) {
    target = SRC + specifier.slice(2);
  } else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith(SRC)) {
    target = new URL(specifier, context.parentURL).href;
  }
  if (target !== specifier && !/\.[cm]?[jt]sx?$/.test(target)) target = sourceFile(target) ?? target;
  // Synchronous hooks (registerHooks) get a result, the older async ones a promise.
  const result = nextResolve(target, context);
  return result instanceof Promise ? result.then(asModule) : asModule(result);
}
