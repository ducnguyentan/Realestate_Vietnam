/**
 * Validate Vietnamese phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Vietnamese phone numbers are 10 digits starting with 0
  return /^0\d{9}$/.test(cleaned);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate price range
 */
export function isValidPriceRange(min?: number, max?: number): boolean {
  if (min === undefined || max === undefined) return true;
  return min <= max;
}

/**
 * Validate area range
 */
export function isValidAreaRange(min?: number, max?: number): boolean {
  if (min === undefined || max === undefined) return true;
  return min <= max && min > 0;
}
