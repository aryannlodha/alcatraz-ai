import { Source, Fact } from '@alcatraz/contracts';

export interface ExtractedText {
  sourceId: string;
  content: string;
  confidence: number;
}

export interface AIProvider {
  name: string;
  isCloud: boolean;
  extractFacts(text: ExtractedText): Promise<Fact[]>;
}

/**
 * Adapter Boundary Phase 5
 * Source Input -> Parsed Text/OCR -> Structured Extraction -> Facts
 */
export class AnalysisPipeline {
  constructor(private aiProvider: AIProvider) {}

  async processSources(sources: Source[]): Promise<Fact[]> {
    const allFacts: Fact[] = [];
    
    for (const source of sources) {
      // 1. Source Input -> Parsed Text/OCR (Mocked for Phase 5)
      const extractedText = await this.extractText(source);
      
      // 2. Parsed Text -> Structured Extraction -> Facts
      const facts = await this.aiProvider.extractFacts(extractedText);
      allFacts.push(...facts);
    }
    
    return allFacts;
  }

  private async extractText(source: Source): Promise<ExtractedText> {
    // Phase 5 Placeholder: Return mock text. Phase 6 will implement Tesseract/OCR
    return {
      sourceId: source.id,
      content: 'MOCK_TEXT_CONTENT',
      confidence: 1.0
    };
  }
}
