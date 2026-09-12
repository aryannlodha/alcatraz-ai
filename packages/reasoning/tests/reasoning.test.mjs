import assert from "node:assert/strict";
import test from "node:test";
import { analyzeApplication, analyzePayment, compareValues, normalizeDate, normalizeDomain } from "../dist/index.js";

const fact = (id, entity, attribute, value, sourceId) => ({
  id, entity, attribute, value, sourceId, confidence: 0.98, evidence: { excerpt: value },
});

test("normalizes equivalent dates", () => {
  assert.equal(normalizeDate("30 September 2026"), "2026-09-30");
  assert.equal(normalizeDate("2026-09-30"), "2026-09-30");
});

test("does not compare masked accounts as complete account numbers", () => {
  assert.equal(compareValues("XXXX1234", "XXXX5678", "account").status, "unknown");
});

test("flags a graduation-year contradiction with high risk", () => {
  const findings = analyzeApplication([
    fact("resume-year", "applicant", "graduation_year", "2028", "resume.pdf"),
    fact("form-year", "applicant", "graduation_year", "2027", "application.png"),
  ]);
  assert.equal(findings[0].status, "mismatch");
  assert.equal(findings[0].severity, "high_risk");
  assert.deepEqual(findings[0].factIds, ["resume-year", "form-year"]);
});

test("flags a full payment destination mismatch", () => {
  const findings = analyzePayment([
    fact("invoice-account", "payment", "account_number", "HDFC000012345", "invoice.pdf"),
    fact("page-account", "payment", "account_number", "HDFC000098765", "payment.png"),
  ]);
  assert.equal(findings[0].status, "mismatch");
  assert.equal(findings[0].severity, "high_risk");
});

test("normalizes a sender email to its domain", () => {
  assert.equal(normalizeDomain("security@example-bank.com"), "example-bank.com");
});
