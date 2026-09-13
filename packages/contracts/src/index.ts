import { z } from 'zod';

export const SeveritySchema = z.enum(['information', 'review', 'warning', 'high_risk']);
export type Severity = z.infer<typeof SeveritySchema>;

export const SourceTypeSchema = z.enum(['pdf', 'image', 'text']);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: SourceTypeSchema,
  isSynthetic: z.boolean().default(false),
  content: z.string().optional(),
});
export type Source = z.infer<typeof SourceSchema>;

export const EvidenceSchema = z.object({
  excerpt: z.string(),
  page: z.number().optional(),
  boundingBox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const FactSchema = z.object({
  id: z.string(),
  entity: z.string(),
  attribute: z.string(),
  value: z.union([z.string(), z.number()]),
  normalizedValue: z.union([z.string(), z.number()]).nullable(),
  confidence: z.number().min(0).max(1),
  sourceId: z.string(),
  evidence: EvidenceSchema,
});
export type Fact = z.infer<typeof FactSchema>;

export const FindingTypeSchema = z.enum(['match', 'possible_match', 'mismatch', 'unknown']);
export type FindingType = z.infer<typeof FindingTypeSchema>;

export const FindingScenarioSchema = z.enum(['application', 'payment', 'email']);
export type FindingScenario = z.infer<typeof FindingScenarioSchema>;

export const FindingSchema = z.object({
  id: z.string(),
  scenario: FindingScenarioSchema,
  type: FindingTypeSchema,
  severity: SeveritySchema,
  confidence: z.number().min(0).max(1),
  ruleId: z.string(),
  explanation: z.string(),
  factIds: z.array(z.string()),
});
export type Finding = z.infer<typeof FindingSchema>;
