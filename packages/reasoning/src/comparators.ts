import Fuse from 'fuse.js';

export type ComparisonResult = 'match' | 'possible_match' | 'mismatch' | 'unknown';

export function compareExact(val1: string, val2: string): ComparisonResult {
  if (val1 === 'UNKNOWN' || val2 === 'UNKNOWN' || !val1 || !val2) return 'unknown';
  return val1 === val2 ? 'match' : 'mismatch';
}

export function compareFuzzy(val1: string, val2: string, threshold = 0.3): ComparisonResult {
  if (val1 === 'UNKNOWN' || val2 === 'UNKNOWN' || !val1 || !val2) return 'unknown';
  if (val1 === val2) return 'match';
  
  const fuse = new Fuse([val1], { includeScore: true, threshold: 1.0 });
  const result = fuse.search(val2);
  
  if (result.length > 0 && result[0].score !== undefined) {
    if (result[0].score <= threshold) {
      return 'possible_match'; // Similar enough, but not identical
    }
  }
  return 'mismatch';
}

/**
 * Compare Accounts safely
 * XXXX1234 vs XXXX5678 -> mismatch
 * XXXX1234 vs XXXX1234 -> possible_match
 * 98761234 vs XXXX1234 -> possible_match (suffix match)
 * 98761234 vs 98761234 -> match
 */
export function compareAccount(val1: string, val2: string): ComparisonResult {
  if (val1 === 'UNKNOWN' || val2 === 'UNKNOWN' || !val1 || !val2) return 'unknown';
  
  const isMasked1 = val1.includes('X') || val1.includes('*');
  const isMasked2 = val2.includes('X') || val2.includes('*');
  
  if (!isMasked1 && !isMasked2) {
    return val1 === val2 ? 'match' : 'mismatch';
  }
  
  // Extract visible digits (usually suffix)
  const digits1 = val1.replace(/[^0-9]/g, '');
  const digits2 = val2.replace(/[^0-9]/g, '');
  
  // If no digits are visible, we can't even compare suffixes safely
  if (!digits1 || !digits2) return 'unknown';

  // Suffix matching
  if (digits1.endsWith(digits2) || digits2.endsWith(digits1)) {
    return 'possible_match';
  }
  
  // If the extracted suffixes do not match, it is definitively a mismatch
  return 'mismatch';
}
