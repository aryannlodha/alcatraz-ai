import { Fact } from '@alcatraz/contracts';

// IMPORTANT: All data below is synthetic demo data.

function createFact(id: string, entity: string, attribute: string, value: string | number, sourceId: string): Fact {
  return {
    id,
    entity,
    attribute,
    value,
    normalizedValue: null,
    confidence: 0.99,
    sourceId,
    evidence: { excerpt: String(value) }
  };
}

export const demo1ApplicationFacts: Fact[] = [
  createFact('d1_f1', 'User', 'graduation_year', '2028', 'resume_synthetic.pdf'),
  createFact('d1_f2', 'User', 'graduation_year', '2027', 'application_form_synthetic.png'),
  createFact('d1_f3', 'Eligibility', 'graduation_year', '2028', 'job_description_synthetic.pdf'),
];

export const demo2PaymentFacts: Fact[] = [
  createFact('d2_f1', 'Vendor', 'account_number', '1234567800001111', 'invoice_synthetic.pdf'),
  createFact('d2_f2', 'Vendor', 'account_number', '1234567800009999', 'payment_screen_synthetic.png'),
];

export const demo3PhishingFacts: Fact[] = [
  createFact('d3_f1', 'Sender', 'sender_domain', 'security@example-bank-support.example', 'email_synthetic.png'),
  createFact('d3_f2', 'Claim', 'claimed_domain', 'examplebank.com', 'email_synthetic.png'),
  createFact('d3_f3', 'Email', 'urgency', 'true', 'email_synthetic.png'),
  createFact('d3_f4', 'Email', 'credential_request', 'true', 'email_synthetic.png'),
];
