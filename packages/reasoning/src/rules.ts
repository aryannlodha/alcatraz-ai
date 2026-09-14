import { Fact, Finding, FindingType, Severity } from '@alcatraz/contracts';
import { normalizeYear, normalizeAccount, normalizeDomain, normalizeNumber, normalizeName } from './normalizers.js';
import { emitLog } from './logger.js';
import { isKnownPhishing } from './bloomFilter.js';
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
  },
  {
    id: 'app_name_consistency',
    scenario: 'application',
    evaluate: (facts) => {
      const nameFacts = facts.filter(f => f.attribute === 'person_name');
      if (nameFacts.length < 2) return null;
      
      const val1 = normalizeName(String(nameFacts[0].value));
      const val2 = normalizeName(String(nameFacts[1].value));
      
      if (compareFuzzy(val1, val2) === 'mismatch') {
        return generateFinding(
          'app_name_consistency',
          'application',
          'mismatch',
          'warning',
          `The applicant name in ${nameFacts[0].sourceId} does not match the name in ${nameFacts[1].sourceId}.`,
          [nameFacts[0].id, nameFacts[1].id]
        );
      }
      return null;
    }
  },
  {
    id: 'app_skills_match',
    scenario: 'application',
    evaluate: (facts) => {
      const reqSkills = facts.filter(f => f.attribute === 'required_skills');
      const listedSkills = facts.filter(f => f.attribute === 'listed_skills');
      if (reqSkills.length === 0 || listedSkills.length === 0) return null;

      const reqVal = String(reqSkills[0].value).toLowerCase();
      const listedVal = String(listedSkills[0].value).toLowerCase();

      const reqWords = reqVal.split(/[,\s]+/).filter(w => w.length > 2);
      let overlap = false;
      for (const w of reqWords) {
        if (listedVal.includes(w)) {
          overlap = true;
          break;
        }
      }

      if (!overlap && reqWords.length > 0) {
         return generateFinding(
           'app_skills_match',
           'application',
           'mismatch',
           'review',
           `The listed skills do not appear to overlap with the required skills.`,
           [reqSkills[0].id, listedSkills[0].id]
         );
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
  },
  {
    id: 'payment_amount_mismatch',
    scenario: 'payment',
    evaluate: (facts) => {
      const amtFacts = facts.filter(f => f.attribute === 'amount');
      if (amtFacts.length < 2) return null;
      
      const val1 = normalizeNumber(amtFacts[0].value);
      const val2 = normalizeNumber(amtFacts[1].value);
      
      if (compareExact(val1, val2) === 'mismatch') {
        return generateFinding(
          'payment_amount_mismatch',
          'payment',
          'mismatch',
          'high_risk',
          `The payment amount (${val1}) differs across sources.`,
          [amtFacts[0].id, amtFacts[1].id]
        );
      }
      return null;
    }
  },
  {
    id: 'payment_vendor_name_mismatch',
    scenario: 'payment',
    evaluate: (facts) => {
      const vendorFacts = facts.filter(f => f.attribute === 'vendor_name');
      if (vendorFacts.length < 2) return null;
      
      const val1 = normalizeName(String(vendorFacts[0].value));
      const val2 = normalizeName(String(vendorFacts[1].value));
      
      if (compareFuzzy(val1, val2) === 'mismatch') {
        return generateFinding(
          'payment_vendor_name_mismatch',
          'payment',
          'mismatch',
          'warning',
          `The vendor name differs across sources.`,
          [vendorFacts[0].id, vendorFacts[1].id]
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
  },
  {
    id: 'email_urgency_flag',
    scenario: 'email',
    evaluate: (facts) => {
      const urgencyFacts = facts.filter(f => f.attribute === 'urgency' && String(f.value) === 'true');
      if (urgencyFacts.length > 0) {
         return generateFinding(
           'email_urgency_flag',
           'email',
           'match',
           'information',
           `Email contains urgency language.`,
           [urgencyFacts[0].id]
         );
      }
      return null;
    }
  },
  {
    id: 'email_credential_request',
    scenario: 'email',
    evaluate: (facts) => {
      const credFacts = facts.filter(f => f.attribute === 'credential_request' && f.value === 'true');
      if (credFacts.length > 0) {
        return generateFinding(
          'email_credential_request',
          'email',
          'match',
          'warning',
          `A message is requesting highly sensitive credentials (like SSN, password, or credit card). This is a strong phishing indicator.`,
          credFacts.map(f => f.id)
        );
      }
      return null;
    }
  },
  {
    id: 'bloom_filter_phishing',
    scenario: 'email',
    evaluate: (facts) => {
      const domainFacts = facts.filter(f => f.attribute === 'claimed_domain' || f.attribute === 'sender_domain');
      for (const fact of domainFacts) {
        const norm = normalizeDomain(String(fact.value));
        if (norm && isKnownPhishing(norm)) {
          return generateFinding(
            'bloom_filter_phishing',
            'email',
            'mismatch',
            'high_risk',
            `The domain ${norm} was found in the local offline Bloom Filter of known malicious phishing sites.`,
            [fact.id]
          );
        }
      }
      return null;
    }
  }
];

export function runEngine(facts: Fact[]): Finding[] {
  emitLog(`[Engine] Initializing rules engine with ${facts.length} facts.`);
  const allRules = [...applicationRules, ...paymentRules, ...emailRules];
  emitLog(`[Engine] Loaded ${allRules.length} total deterministic rules.`);
  const findings: Finding[] = [];
  
  for (const rule of allRules) {
    const finding = rule.evaluate(facts);
    if (finding) findings.push(finding);
  }
  
  return findings;
}
