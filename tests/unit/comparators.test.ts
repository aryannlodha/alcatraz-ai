import { describe, it, expect } from 'vitest';
import { compareExact, compareFuzzy, compareAccount } from '@alcatraz/reasoning';

describe('Comparators', () => {
  describe('compareExact', () => {
    it('returns match for exact identical strings', () => {
      expect(compareExact('2028', '2028')).toBe('match');
    });
    it('returns mismatch for differing strings', () => {
      expect(compareExact('2028', '2027')).toBe('mismatch');
    });
    it('returns unknown if either value is UNKNOWN or empty', () => {
      expect(compareExact('2028', 'UNKNOWN')).toBe('unknown');
      expect(compareExact('', '2028')).toBe('unknown');
    });
  });

  describe('compareAccount', () => {
    it('exact match for fully visible accounts', () => {
      expect(compareAccount('12345678', '12345678')).toBe('match');
      expect(compareAccount('12345678', '87654321')).toBe('mismatch');
    });
    it('possible_match if identical masked strings', () => {
      expect(compareAccount('XXXX1234', 'XXXX1234')).toBe('possible_match');
    });
    it('mismatch if masked suffixes differ', () => {
      expect(compareAccount('XXXX1234', 'XXXX5678')).toBe('mismatch');
    });
    it('possible_match if full account ends with masked suffix', () => {
      expect(compareAccount('98761234', 'XXXX1234')).toBe('possible_match');
      expect(compareAccount('**1234', '98761234')).toBe('possible_match');
    });
    it('mismatch if full account does not end with masked suffix', () => {
      expect(compareAccount('98765678', 'XXXX1234')).toBe('mismatch');
    });
  });

  describe('compareFuzzy', () => {
    it('matches exact strings', () => {
      expect(compareFuzzy('acme corp', 'acme corp')).toBe('match');
    });
    it('possible_match for slight typos', () => {
      expect(compareFuzzy('aryan lodha', 'aryan loda')).toBe('possible_match');
    });
    it('mismatch for completely different strings', () => {
      expect(compareFuzzy('acme corp', 'global tech inc')).toBe('mismatch');
    });
  });
});
