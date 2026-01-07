/**
 * Polyfills for Railway deployment environment
 * This file MUST be imported first, before any other modules
 */
import * as crypto from 'node:crypto';

// Polyfill globalThis.crypto for Railway environment
// TypeORM and other libraries expect this to be available
if (!globalThis.crypto) {
  // @ts-expect-error - Railway environment doesn't have globalThis.crypto
  globalThis.crypto = crypto.webcrypto;
}
