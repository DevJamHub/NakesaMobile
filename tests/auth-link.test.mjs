import assert from 'node:assert/strict';
import { test } from 'node:test';

import { linkParams, parseAuthLink } from '../src/features/auth/auth-link.ts';

test('a confirmation link starts a session', () => {
  assert.deepEqual(
    parseAuthLink('nakesapatient://auth/callback#access_token=abc&expires_in=3600&refresh_token=def&token_type=bearer&type=signup'),
    { kind: 'session', accessToken: 'abc', refreshToken: 'def', type: 'signup' },
  );
});

test('a password reset link is recognised, also from Expo Go', () => {
  const link = parseAuthLink('exp://192.168.1.5:8081/--/auth/callback#access_token=a&refresh_token=b&type=recovery');
  assert.equal(link.kind, 'session');
  assert.equal(link.type, 'recovery');
});

test('an expired link reports why', () => {
  assert.deepEqual(
    parseAuthLink(
      'nakesapatient://auth/callback?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired',
    ),
    { kind: 'error', code: 'otp_expired', description: 'Email link is invalid or has expired' },
  );
  assert.deepEqual(parseAuthLink('nakesapatient://auth/callback#error=access_denied&error_code=otp_expired'), {
    kind: 'error',
    code: 'otp_expired',
    description: 'access_denied',
  });
});

test('a link without both tokens is incomplete', () => {
  assert.deepEqual(parseAuthLink('nakesapatient://auth/callback'), { kind: 'none' });
  assert.deepEqual(parseAuthLink('nakesapatient://auth/callback#access_token=abc'), { kind: 'none' });
  assert.deepEqual(parseAuthLink('nakesapatient://auth/callback#access_token=&refresh_token=def'), { kind: 'none' });
});

test('link parameters are decoded; the first value of a name wins', () => {
  const params = linkParams('x://a/b?b=1&b=2&c=%20d+e&flag#f=3&b=4&broken=%E0%A4%A');
  assert.equal(params.b, '1');
  assert.equal(params.c, ' d e');
  assert.equal(params.flag, '');
  assert.equal(params.f, '3');
  assert.equal(params.broken, '%E0%A4%A');
});

test('odd parameter names cannot change the result object', () => {
  const params = linkParams('x://a#__proto__=x&constructor=y&access_token=t');
  assert.equal(Object.getPrototypeOf(params), Object.prototype);
  assert.equal(Object.hasOwn(params, '__proto__'), true);
  assert.equal(params.constructor, 'y');
  assert.equal(params.access_token, 't');
});
