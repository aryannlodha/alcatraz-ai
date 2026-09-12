import { describe, it, expect } from 'vitest';
import { normalizeDate, normalizeAccount, normalizeDomain, normalizeName, normalizeNumber, normalizeText, normalizeYear } from '@alcatraz/reasoning';

describe('Normalizers', () => {
  describe('normalizeDate', () => {
    it('parses YYYY-MM-DD exactly', () => {
      expect(normalizeDate('2026-09-30')).toBe('2026-09-30');
    });
    it('safely parses explicit human formats without timezone risk', () => {
      expect(normalizeDate('30 September 2026')).toBe('2026-09-30');
      expect(normalizeDate('September 30, 2026')).toBe('2026-09-30');
    });
    it('returns UNKNOWN for unsafe or missing formats', () => {
      // 09/10/2026 could be Sep 10 or Oct 9 depending on locale.
      expect(normalizeDate('09/10/2026')).toBe('UNKNOWN');
      expect(normalizeDate('Yesterday')).toBe('UNKNOWN');
      expect(normalizeDate('')).toBe('UNKNOWN');
    });
  });

  describe('normalizeAccount', () => {
    it('removes spaces and dashes', () => {
      expect(normalizeAccount('1234-5678')).toBe('12345678');
      expect(normalizeAccount(' 12 34 ')).toBe('1234');
    });
    it('preserves masked characters', () => {
      expect(normalizeAccount('XXXX-1234')).toBe('XXXX1234');
      expect(normalizeAccount('**1234')).toBe('**1234');
    });
  });

  describe('normalizeDomain', () => {
    it('extracts registrable domain from URLs', () => {
      expect(normalizeDomain('https://support.example.com/login')).toBe('example.com');
      expect(normalizeDomain('example.co.uk')).toBe('example.co.uk');
      expect(normalizeDomain('http://localhost:3000')).toBe('UNKNOWN');
    });
  });

  describe('normalizeName', () => {
    it('lowercases and removes punctuation', () => {
      expect(normalizeName('Aryan Lodha!')).toBe('aryan lodha');
      expect(normalizeName('ACME Corp, LLC.')).toBe('acme corp llc');
    });
  });

  describe('normalizeNumber', () => {
    it('extracts numbers and decimals', () => {
      expect(normalizeNumber('$24,500.50')).toBe('24500.5');
      expect(normalizeNumber('USD 100')).toBe('100');
    });
    it('returns UNKNOWN if no number found', () => {
      expect(normalizeNumber('free')).toBe('UNKNOWN');
    });
  });
});
