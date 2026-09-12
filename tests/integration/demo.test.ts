import { describe, it, expect } from 'vitest';
import { runEngine } from '@alcatraz/reasoning';
import { demo1ApplicationFacts, demo2PaymentFacts, demo3PhishingFacts } from '../../demo/synthetic_data';

describe('Integration: Synthetic Demo Scenarios', () => {
  it('Demo 1: Application Consistency', () => {
    const findings = runEngine(demo1ApplicationFacts);
    expect(findings.length).toBeGreaterThan(0);
    const yearFinding = findings.find(f => f.ruleId === 'app_year_consistency');
    expect(yearFinding).toBeDefined();
    expect(yearFinding?.severity).toBe('high_risk');
    
    const eligFinding = findings.find(f => f.ruleId === 'app_eligibility_violation');
    expect(eligFinding).toBeDefined();
    expect(eligFinding?.severity).toBe('high_risk');
  });

  it('Demo 2: Payment Verification', () => {
    const findings = runEngine(demo2PaymentFacts);
    expect(findings.length).toBeGreaterThan(0);
    const accFinding = findings.find(f => f.ruleId === 'payment_account_mismatch');
    expect(accFinding).toBeDefined();
    expect(accFinding?.severity).toBe('high_risk');
  });

  it('Demo 3: Phishing Risk', () => {
    const findings = runEngine(demo3PhishingFacts);
    expect(findings.length).toBeGreaterThan(0);
    const domainFinding = findings.find(f => f.ruleId === 'email_domain_mismatch');
    expect(domainFinding).toBeDefined();
    expect(domainFinding?.severity).toBe('warning');
  });
});
