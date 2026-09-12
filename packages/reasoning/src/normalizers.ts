import { parse, isValid } from 'date-fns';
import { getDomain } from 'tldts';

/**
 * Text normalizer: trims and normalizes whitespace
 */
export function normalizeText(val: string | number): string {
  return String(val).trim().replace(/\s+/g, ' ');
}

/**
 * Name normalizer: lowercases and removes punctuation for fuzzy matching
 */
export function normalizeName(val: string): string {
  return normalizeText(val).toLowerCase().replace(/[^\w\s]/gi, '');
}

/**
 * Date normalizer: Explicit formats, NO timezone inference.
 * Returns ISO date (YYYY-MM-DD) or 'UNKNOWN'
 */
export function normalizeDate(val: string): string {
  const clean = normalizeText(val);
  
  // Try YYYY-MM-DD
  const matchIso = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (matchIso) {
    const [_, y, m, d] = matchIso;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // Try explicit parsing: MM/DD/YYYY, DD/MM/YYYY, etc. is unsafe without context,
  // but let's safely parse standard explicit formats like "30 September 2026"
  const parsed1 = parse(clean, 'd MMMM yyyy', new Date(0));
  if (isValid(parsed1) && parsed1.getFullYear() > 1900) {
    return `${parsed1.getFullYear()}-${String(parsed1.getMonth() + 1).padStart(2, '0')}-${String(parsed1.getDate()).padStart(2, '0')}`;
  }

  const parsed2 = parse(clean, 'MMMM d, yyyy', new Date(0));
  if (isValid(parsed2) && parsed2.getFullYear() > 1900) {
    return `${parsed2.getFullYear()}-${String(parsed2.getMonth() + 1).padStart(2, '0')}-${String(parsed2.getDate()).padStart(2, '0')}`;
  }

  return 'UNKNOWN';
}

/**
 * Year normalizer
 */
export function normalizeYear(val: string | number): string {
  const clean = String(val).trim();
  if (/^\d{4}$/.test(clean)) return clean;
  return 'UNKNOWN';
}

/**
 * Numeric / Currency normalizer: extracts just the digits/decimals
 */
export function normalizeNumber(val: string | number): string {
  const clean = String(val).replace(/[^\d.]/g, '');
  const parsed = parseFloat(clean);
  if (isNaN(parsed)) return 'UNKNOWN';
  return parsed.toString();
}

/**
 * Account Identifier normalizer.
 * Rule: Masked accounts must return UNKNOWN (or stay masked) to prevent false exact matches.
 */
export function normalizeAccount(val: string): string {
  const clean = String(val).replace(/\s|-/g, '');
  if (clean.includes('X') || clean.includes('*')) {
    // Retain the mask, comparators will handle this carefully
    return clean;
  }
  return clean;
}

/**
 * Email normalizer
 */
export function normalizeEmail(val: string): string {
  return normalizeText(val).toLowerCase();
}

/**
 * URL / Domain normalizer
 * Uses public suffix list to get the registrable domain
 */
export function normalizeDomain(val: string): string {
  let clean = normalizeText(val).toLowerCase();
  if (!clean.startsWith('http')) {
    clean = 'https://' + clean;
  }
  try {
    const domain = getDomain(clean);
    return domain || 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
  }
}
