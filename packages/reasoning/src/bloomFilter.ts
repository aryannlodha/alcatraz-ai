// A super simple, deterministic fake bloom filter (array) for local validation
// In a real app this would be a compressed bit-array checking hashes.
export const KNOWN_PHISHING_DOMAINS = new Set([
  'scam-verify.com',
  'paypal-support-urgent.com',
  'netflix-billing-update.info',
  'amazon-secure-login.net',
  'chase-bank-alert.org'
]);

export function isKnownPhishing(domain: string): boolean {
  return KNOWN_PHISHING_DOMAINS.has(domain.toLowerCase());
}
