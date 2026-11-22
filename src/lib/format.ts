/** Keep digits only, capped at `length` characters (for OTP inputs). */
export function sanitizeOtp(value: string, length = 6): string {
  return value.replace(/\D/g, '').slice(0, length);
}

/** Two-digit display index, e.g. 3 -> "03". */
export function padIndex(n: number): string {
  return String(n).padStart(2, '0');
}
