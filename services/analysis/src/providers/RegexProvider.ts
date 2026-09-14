import { Fact } from '@alcatraz/contracts';
import { AIProvider, ExtractedText } from '../pipeline.js';

export class RegexProvider implements AIProvider {
  name = 'RegexProvider';
  isCloud = false;

  async extractFacts(text: ExtractedText): Promise<Fact[]> {
    const facts: Fact[] = [];
    const content = text.content;
    if (!content) return facts;

    const patterns = [
      { attribute: 'graduation_year', regex: /\b(202[0-9]|2030)\b/g, entity: 'User' },
      { attribute: 'account_number', regex: /\b(\d{8,}|[X*]{4,}\d{4})\b/g, entity: 'Payment' },
      { attribute: 'amount', regex: /(\$[0-9,]+(?:\.[0-9]{2})?|USD\s[0-9,]+(?:\.[0-9]{2})?)/g, entity: 'Payment' },
      { attribute: 'email_address', regex: /\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/g, entity: 'Sender' },
      { attribute: 'sender_domain', regex: /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/g, entity: 'Sender' },
      { attribute: 'claimed_domain', regex: /https?:\/\/(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, entity: 'Claim' },
      { attribute: 'person_name', regex: /(?:Name|Applicant|From):\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/g, entity: 'User' },
      { attribute: 'vendor_name', regex: /(?:Vendor|Company|From|Bill from):\s*([A-Z][A-Za-z0-9&\s]+?)(?=\n|,|$)/g, entity: 'Vendor' },
      { attribute: 'date', regex: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})\b/ig, entity: 'Date' },
      { attribute: 'urgency', regex: /\b(urgent|immediately|act now|24 hours|expire)\b/ig, entity: 'Email' },
      { attribute: 'credential_request', regex: /\b(password|login|verify your account|SSN|credit card number)\b/ig, entity: 'Email' }
    ];

    for (const p of patterns) {
      let match;
      while ((match = p.regex.exec(content)) !== null) {
        const value = match[1] || match[0];
        
        const start = Math.max(0, match.index - 30);
        const end = Math.min(content.length, match.index + value.length + 30);
        const excerpt = content.substring(start, end).replace(/\n/g, ' ').trim();

        // If the rule expects 'true', we'll store 'true' for urgency and credential_request
        const finalValue = (p.attribute === 'urgency' || p.attribute === 'credential_request') ? 'true' : value;

        facts.push({
          id: `fact_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          entity: p.entity,
          attribute: p.attribute,
          value: finalValue,
          normalizedValue: null,
          confidence: 0.85,
          sourceId: text.sourceId,
          evidence: { excerpt }
        });
      }
    }

    return facts;
  }
}
