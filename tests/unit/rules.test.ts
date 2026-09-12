import { describe, it, expect } from 'vitest';
import { runEngine } from '@alcatraz/reasoning';
import { Fact } from '@alcatraz/contracts';

function createFact(id: string, entity: string, attribute: string, value: string | number, confidence = 0.99): Fact {
  return {
    id,
    entity,
    attribute,
    value,
    normalizedValue: null,
    confidence,
    sourceId: 'source_1',
    evidence: { excerpt: value.toString() }
  };
}

describe('Rules Engine', () => {
  describe('Application Scenario', () => {
    it('flags graduation year contradiction as high risk', () => {
      const facts = [
        createFact('f1', 'User', 'graduation_year', '2028'),
        createFact('f2', 'User', 'graduation_year', '2027'),
      ];
      
      const findings = runEngine(facts);
      expect(findings.length).toBe(1);
      expect(findings[0].ruleId).toBe('app_year_consistency');
      expect(findings[0].severity).toBe('high_risk');
      expect(findings[0].type).toBe('mismatch');
    });

    it('flags eligibility violation distinct from standard mismatch', () => {
      const facts = [
        createFact('f1', 'User', 'graduation_year', '2027'),
        createFact('f2', 'Eligibility', 'graduation_year', '2028'),
      ];
      
      const findings = runEngine(facts);
      expect(findings.length).toBe(1);
      expect(findings[0].ruleId).toBe('app_eligibility_violation');
      expect(findings[0].severity).toBe('high_risk');
    });
  });

  describe('Payment Scenario', () => {
    it('flags masked account mismatch as high_risk (if high confidence)', () => {
      const facts = [
        createFact('f1', 'Vendor', 'account_number', 'XXXX1234', 0.99),
        createFact('f2', 'Vendor', 'account_number', 'XXXX5678', 0.99),
      ];
      
      const findings = runEngine(facts);
      expect(findings.length).toBe(1);
      expect(findings[0].ruleId).toBe('payment_account_mismatch');
      expect(findings[0].severity).toBe('high_risk');
    });

    it('flags account mismatch as warning if extraction confidence is low', () => {
      const facts = [
        createFact('f1', 'Vendor', 'account_number', 'XXXX1234', 0.50), // low confidence
        createFact('f2', 'Vendor', 'account_number', 'XXXX5678', 0.99),
      ];
      
      const findings = runEngine(facts);
      expect(findings.length).toBe(1);
      expect(findings[0].severity).toBe('warning'); // Downgraded to warning
    });

    it('does not flag possible matches (e.g. same masked suffix)', () => {
      const facts = [
        createFact('f1', 'Vendor', 'account_number', '98761234', 0.99),
        createFact('f2', 'Vendor', 'account_number', 'XXXX1234', 0.99),
      ];
      const findings = runEngine(facts);
      expect(findings.length).toBe(0);
    });
  });

  describe('Email Scenario', () => {
    it('flags email domain vs claimed domain mismatch', () => {
      const facts = [
        createFact('f1', 'Sender', 'sender_domain', 'security@example-bank-support.example'),
        createFact('f2', 'Claim', 'claimed_domain', 'examplebank.com'),
      ];
      
      const findings = runEngine(facts);
      expect(findings.length).toBe(1);
      expect(findings[0].ruleId).toBe('email_domain_mismatch');
      expect(findings[0].severity).toBe('warning');
    });
  });
});
