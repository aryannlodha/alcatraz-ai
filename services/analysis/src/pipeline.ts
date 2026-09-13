import { Source, Fact, Finding } from '@alcatraz/contracts';
import { runEngine } from '@alcatraz/reasoning';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

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

export interface AnalysisResult {
  facts: Fact[];
  findings: Finding[];
}

export class AnalysisPipeline {
  constructor(private aiProvider: AIProvider) {}

  async processSources(sources: Source[]): Promise<AnalysisResult> {
    const allFacts: Fact[] = [];
    
    for (const source of sources) {
      console.log(`Extracting text from ${source.name}...`);
      const extractedText = await this.extractText(source);
      
      console.log(`Extracting structured facts via AI...`);
      const facts = await this.aiProvider.extractFacts(extractedText);
      allFacts.push(...facts);
    }
    
    // Phase 8: Cross-checking execution
    console.log('Running Deterministic Reasoning Engine on extracted facts...');
    const findings = runEngine(allFacts);
    
    return {
      facts: allFacts,
      findings
    };
  }

  private async extractText(source: Source): Promise<ExtractedText> {
    if (!source.content) {
      return { sourceId: source.id, content: '', confidence: 0 };
    }

    try {
      if (source.type === 'text') {
        return { sourceId: source.id, content: source.content, confidence: 1.0 };
      } 
      
      if (source.type === 'image') {
        // Run Tesseract OCR on Data URL
        const worker = await createWorker('eng');
        const ret = await worker.recognize(source.content);
        const text = ret.data.text;
        const confidence = ret.data.confidence / 100; // 0 to 1
        await worker.terminate();
        return { sourceId: source.id, content: text, confidence };
      }
      
      if (source.type === 'pdf') {
        // Base64 decoding
        const base64Data = source.content.split(',')[1];
        if (!base64Data) return { sourceId: source.id, content: '', confidence: 0 };
        
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Setup PDF.js worker (relying on vite or unpkg fallback)
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        return { sourceId: source.id, content: fullText, confidence: 0.95 }; // PDF text layer is generally high confidence
      }
    } catch (e) {
      console.error(`Extraction failed for ${source.name}`, e);
    }

    return { sourceId: source.id, content: '', confidence: 0 };
  }
}
