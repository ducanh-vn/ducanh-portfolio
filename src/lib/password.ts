import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const PREFIX = 'scrypt';
const SEPARATOR = '$';
const KEY_LENGTH = 64;

/** Hash a password as "scrypt$<salt hex>$<hash hex>". */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH);
  return [PREFIX, salt.toString('hex'), hash.toString('hex')].join(SEPARATOR);
}

export function isHashed(stored: string): boolean {
  return stored.startsWith(PREFIX + SEPARATOR);
}

/** Compare a candidate with a stored value; accepts legacy plain-text values too. */
export function verifyPassword(candidate: string, stored: string): boolean {
  if (!candidate || !stored) return false;

  if (!isHashed(stored)) {
    const a = Buffer.from(candidate);
    const b = Buffer.from(stored);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  const [, saltHex, hashHex] = stored.split(SEPARATOR);
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(candidate, Buffer.from(saltHex, 'hex'), expected.length);
  return timingSafeEqual(actual, expected);
}
