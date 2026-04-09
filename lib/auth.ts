import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'abujanda_session';
export const DUMMY_USERNAME = process.env.DUMMY_USERNAME || 'abujanda';
export const DUMMY_PASSWORD = process.env.DUMMY_PASSWORD || 'abujanda';

export function isValidDummyUser(username: string, password: string) {
  return username === DUMMY_USERNAME && password === DUMMY_PASSWORD;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');

  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');

  if (derivedKey.length != keyBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, keyBuffer);
}
