import { Fact, Finding, FindingType, Severity } from '@alcatraz/contracts';
import { normalizeYear, normalizeAccount, normalizeDomain, normalizeNumber, normalizeName } from './normalizers.js';
import { compareExact, compareAccount, compareFuzzy, ComparisonResult } from './comparators.js';

export interface Rule {
  id: string;
  scenario: 'application' | 'payment' | 'email';
  evaluate: (facts: Fact[]) => Finding | null;
}

const CONFIDENCE_THRESHOLD = 0.6;

function generateFinding(
  id: string,
  scenario: 'application' | 'payment' | 'email',
  type: FindingType,
  severity: Severity,
  explanation: string,
  factIds: string[]
): Finding {
  return {
    id: `finding_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    scenario,
    type,
    severity,
    confidence: 1.0, // Engine confidence is deterministic
    ruleId: id,
    explanation,
    factIds,
  };
}

export const applicationRules: Rule[] = [
  {
    id: 'app_year_consistency',
    scenario: 'application',
    evaluate: (facts) => {
      const yearFacts = facts.filter(f => f.attribute === 'graduation_year' && f.entity !== 'Eligibility');
      if (yearFacts.length < 2) return null;
      
      const val1 = normalizeYear(yearFacts[0].value);
      const val2 = normalizeYear(yearFacts[1].value);
      
      if (compareExact(val1, val2) === 'mismatch') {
        return generateFinding(
          'app_year_consistency',
          'application',
          'mismatch',
          'high_risk',
          `The graduation year (${val1}) in the ${yearFacts[0].sourceId} does not match the graduation year (${val2}) in the ${yearFacts[1].sourceId}.`,
          [yearFacts[0].id, yearFacts[1].id]
        );
      }
      return null;
    }
  },
  {
    id: 'app_eligibility_violation',
    scenario: 'application',
    evaluate: (facts) => {
      const reqFacts = facts.filter(f => f.attribute === 'graduation_year' && f.entity === 'Eligibility');
      const appFacts = facts.filter(f => f.attribute === 'graduation_year' && f.entity === 'User');
      
      if (reqFacts.length === 0 || appFacts.length === 0) return null;
      
      const reqVal = normalizeYear(reqFacts[0].value);
      
      for (const appFact of appFacts) {
        const appVal = normalizeYear(appFact.value);
        if (compareExact(reqVal, appVal) === 'mismatch') {
          return generateFinding(
            'app_eligibility_violation',
            'application',
            'mismatch',
            'high_risk',
            `The applicant's graduation year (${appVal}) fails the stated job eligibility requirement (${reqVal}).`,
            [appFact.id, reqFacts[0].id]
          );
        }
      }
      return null;
    }
  }
];

export const paymentRules: Rule[] = [
  {
    id: 'payment_account_mismatch',
    scenario: 'payment',
    evaluate: (facts) => {
      const accFacts = facts.filter(f => f.attribute === 'account_number');
      if (accFacts.length < 2) return null;
      
      // If either extraction confidence is very low, do not immediately escalate to high_risk fraud
      const lowConfidence = accFacts.some(f => f.confidence < CONFIDENCE_THRESHOLD);
      
      const val1 = normalizeAccount(String(accFacts[0].value));
      const val2 = normalizeAccount(String(accFacts[1].value));
      
      const comp = compareAccount(val1, val2);
      
      if (comp === 'mismatch') {
        return generateFinding(
          'payment_account_mismatch',
          'payment',
          'mismatch',
          lowConfidence ? 'warning' : 'high_risk',
          `The payment destination account (${val2}) differs from the account specified on the invoice (${val1}).`,
          [accFacts[0].id, accFacts[1].id]
        );
      }
      return null;
    }
  }
];

export const emailRules: Rule[] = [
  {
    id: 'email_domain_mismatch',
    scenario: 'email',
    evaluate: (facts) => {
      const senderFacts = facts.filter(f => f.attribute === 'sender_domain');
      const claimFacts = facts.filter(f => f.attribute === 'claimed_domain');
      
      if (senderFacts.length === 0 || claimFacts.length === 0) return null;
      
      const senderDomain = normalizeDomain(String(senderFacts[0].value));
      const claimedDomain = normalizeDomain(String(claimFacts[0].value));
      
      if (compareExact(senderDomain, claimedDomain) === 'mismatch') {
        return generateFinding(
          'email_domain_mismatch',
          'email',
          'mismatch',
          'warning',
          `Sender domain (${senderDomain}) does not match the claimed organization domain (${claimedDomain}). Potential phishing risk.`,
          [senderFacts[0].id, claimFacts[0].id]
        );
      }
      return null;
    }
  }
];

export function runEngine(facts: Fact[]): Finding[] {
  const allRules = [...applicationRules, ...paymentRules, ...emailRules];
  const findings: Finding[] = [];
  
  for (const rule of allRules) {
    const finding = rule.evaluate(facts);
    if (finding) findings.push(finding);
  }
  
  return findings;
}
